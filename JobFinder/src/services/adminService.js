import User from "../../DB/models/User.js";
import Job from "../../DB/models/Job.js";
import { createError } from "../../utils/handleErrors.js";

// Get all users for admin
const getAllUsers = async () => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    return users;
  } catch (error) {
    return createError("Database", error);
  }
};

// Get all jobs for admin (including inactive)
const getAllJobsForAdmin = async () => {
  try {
    const jobs = await Job.find({})
      .populate("postedBy", "name.first name.last email")
      .sort({ createdAt: -1 });
    return jobs;
  } catch (error) {
    return createError("Database", error);
  }
};

// Update user role (supports jobseeker, recruiter, admin)
const updateUserRole = async (userId, newRole) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    
    // Validate role
    if (!['jobseeker', 'recruiter', 'admin'].includes(newRole)) {
      const error = new Error("Invalid role. Must be 'jobseeker', 'recruiter', or 'admin'");
      error.status = 400;
      throw error;
    }
    
    user.role = newRole;
    
    // Set isAdmin based on role
    if (newRole === 'admin') {
      user.isAdmin = true;
    } else {
      user.isAdmin = false;
    }
    
    await user.save();
    
    return await User.findById(userId).select("-password");
  } catch (error) {
    return createError("Database", error);
  }
};

// Toggle user status (active/inactive)
const toggleUserStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    
    // Toggle isActive field
    const isActive = user.isActive !== undefined ? !user.isActive : false;
    user.isActive = isActive;
    await user.save();
    
    return {
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: await User.findById(userId).select("-password")
    };
  } catch (error) {
    return createError("Database", error);
  }
};

// Delete user
const deleteUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    
    // Prevent deleting the last admin
    if (user.isAdmin) {
      const adminCount = await User.countDocuments({ isAdmin: true });
      if (adminCount <= 1) {
        const error = new Error("Cannot delete the last admin user");
        error.status = 400;
        throw error;
      }
    }
    
    // If user is a recruiter, delete their job posts
    if (user.role === "recruiter") {
      await Job.deleteMany({ postedBy: userId });
    }
    
    // Remove user from job applications
    await Job.updateMany(
      { applicants: userId },
      { $pull: { applicants: userId } }
    );
    
    await User.findByIdAndDelete(userId);
    
    return { message: "User deleted successfully" };
  } catch (error) {
    return createError("Database", error);
  }
};

// Get system statistics
const getSystemStats = async () => {
  try {
    const [
      totalUsers,
      totalJobs,
      activeJobs,
      totalRecruiters,
      totalJobSeekers,
      totalAdmins,
      recentUsers,
      recentJobs
    ] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Job.countDocuments({ isActive: true }),
      User.countDocuments({ role: "recruiter" }),
      User.countDocuments({ role: "jobseeker" }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ 
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
      }),
      Job.countDocuments({ 
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
      })
    ]);
    
    // Get total applications count
    const jobsWithApplicants = await Job.find({}, 'applicants');
    const totalApplications = jobsWithApplicants.reduce(
      (acc, job) => acc + (job.applicants ? job.applicants.length : 0), 
      0
    );
    
    // Get jobs by type
    const jobsByType = await Job.aggregate([
      { $group: { _id: "$jobType", count: { $sum: 1 } } }
    ]);
    
    // Get users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);
    
    // Get recent activity (last 30 days)
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentActivity = {
      newUsers: await User.countDocuments({ createdAt: { $gte: last30Days } }),
      newJobs: await Job.countDocuments({ createdAt: { $gte: last30Days } }),
      newApplications: 0 // We'll calculate this separately if needed
    };
    
    return {
      general: {
        totalUsers,
        totalJobs,
        activeJobs,
        totalApplications,
        totalRecruiters,
        totalJobSeekers,
        totalAdmins
      },
      recent: {
        recentUsers,
        recentJobs,
        ...recentActivity
      },
      jobsByType: jobsByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };
  } catch (error) {
    return createError("Database", error);
  }
};

// Get user activity logs (for future implementation)
const getUserActivityLogs = async (userId, limit = 50) => {
  try {
    // This would require implementing an activity log system
    // For now, we'll return basic user information
    const user = await User.findById(userId).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    
    // Get user's jobs if they're a recruiter
    let userJobs = [];
    if (user.role === "recruiter") {
      userJobs = await Job.find({ postedBy: userId }).select("title createdAt applicants");
    }
    
    // Get user's applications if they're a job seeker
    let userApplications = [];
    if (user.role === "jobseeker") {
      userApplications = await Job.find(
        { applicants: userId },
        "title company createdAt"
      ).populate("postedBy", "name.first name.last");
    }
    
    return {
      user,
      jobs: userJobs,
      applications: userApplications,
      stats: {
        jobsPosted: userJobs.length,
        applicationsReceived: userJobs.reduce((acc, job) => acc + job.applicants.length, 0),
        jobsAppliedTo: userApplications.length
      }
    };
  } catch (error) {
    return createError("Database", error);
  }
};

// Bulk operations
const bulkDeleteUsers = async (userIds) => {
  try {
    // Validate that we're not deleting all admins
    const adminUsers = await User.find({ 
      _id: { $in: userIds }, 
      isAdmin: true 
    });
    
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    
    if (adminUsers.length >= totalAdmins) {
      const error = new Error("Cannot delete all admin users");
      error.status = 400;
      throw error;
    }
    
    // Get recruiters to delete their jobs
    const recruiters = await User.find({ 
      _id: { $in: userIds }, 
      role: "recruiter" 
    });
    
    const recruiterIds = recruiters.map(r => r._id);
    
    // Delete jobs posted by these recruiters
    if (recruiterIds.length > 0) {
      await Job.deleteMany({ postedBy: { $in: recruiterIds } });
    }
    
    // Remove users from job applications
    await Job.updateMany(
      { applicants: { $in: userIds } },
      { $pullAll: { applicants: userIds } }
    );
    
    // Delete the users
    const result = await User.deleteMany({ _id: { $in: userIds } });
    
    return {
      message: `Successfully deleted ${result.deletedCount} users`,
      deletedCount: result.deletedCount,
      jobsDeleted: recruiterIds.length > 0 ? await Job.countDocuments({ postedBy: { $in: recruiterIds } }) : 0
    };
  } catch (error) {
    return createError("Database", error);
  }
};

// System maintenance operations
const cleanupInactiveJobs = async (daysOld = 90) => {
  try {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    
    const result = await Job.deleteMany({
      isActive: false,
      updatedAt: { $lt: cutoffDate }
    });
    
    return {
      message: `Cleaned up ${result.deletedCount} inactive jobs older than ${daysOld} days`,
      deletedCount: result.deletedCount
    };
  } catch (error) {
    return createError("Database", error);
  }
};

const cleanupOldApplications = async (daysOld = 180) => {
  try {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    
    // This would require implementing an applications tracking system
    // For now, we'll just return a placeholder
    return {
      message: `Application cleanup feature not yet implemented`,
      deletedCount: 0
    };
  } catch (error) {
    return createError("Database", error);
  }
};

export {
  getAllUsers,
  getAllJobsForAdmin,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getSystemStats,
  getUserActivityLogs,
  bulkDeleteUsers,
  cleanupInactiveJobs,
  cleanupOldApplications
};