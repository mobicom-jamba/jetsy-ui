// client/src/components/Settings/ProfileSettings.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "@/types/auth";
import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import { UserIcon, CameraIcon } from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils";
import api from "@/lib/api";

interface ProfileData {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  lastLoginAt: any;
}

interface ProfileSettingsProps {
  user: User | null;
}

export default function ProfileSettings({ user }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch: watchPassword,
  } = useForm<ProfileData>();

  const newPassword = watchPassword("newPassword");

  const onUpdateProfile = async (data: ProfileData) => {
    setUpdateLoading(true);
    try {
      const response = await api.put("/auth/profile", {
        name: data.name,
        email: data.email,
      });

      alert("Profile updated successfully!");
      setIsEditing(false);

      // Update local user data if you have a user context
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      alert(error.response?.data?.error || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const onChangePassword = async (data: ProfileData) => {
    setPasswordLoading(true);
    try {
      await api.put("/auth/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      alert("Password changed successfully!");
      setIsChangingPassword(false);
      resetPassword();
    } catch (error: any) {
      console.error("Failed to change password:", error);
      alert(error.response?.data?.error || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await api.post("/auth/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Avatar uploaded successfully!");
      // Refresh user data
    } catch (error: any) {
      console.error("Failed to upload avatar:", error);
      alert("Failed to upload avatar");
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Profile Information Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Profile Information
          </h3>
          <Button
            variant={isEditing ? "primary" : "outline"}
            size="sm"
            onClick={() => {
              if (isEditing) {
                handleSubmit(onUpdateProfile)();
              } else {
                setIsEditing(true);
                reset({
                  name: user?.name || "",
                  email: user?.email || "",
                });
              }
            }}
            loading={updateLoading}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-10 w-10 text-primary-600" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer hover:bg-gray-50">
                <CameraIcon className="h-4 w-4 text-gray-600" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Profile Photo
              </h4>
              <p className="text-sm text-gray-500">
                Upload a profile picture to personalize your account
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                disabled={!isEditing}
                error={errors.name?.message}
              />

              <Input
                label="Email Address"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                disabled={!isEditing}
                error={errors.email?.message}
              />
            </div>
          </form>

          {/* Account Details */}
          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              Account Details
            </h4>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="font-medium text-gray-500">Account Created</dt>
                <dd className="text-gray-900 mt-1">
                  {formatDate(user?.createdAt || "")}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Last Login</dt>
                <dd className="text-gray-900 mt-1">
                  {user?.lastLoginAt ? formatDate(user.lastLoginAt) : "Never"}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">User ID</dt>
                <dd className="text-gray-900 mt-1 font-mono text-xs">
                  {user?.id}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Change Password
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Update your password to keep your account secure
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsChangingPassword(!isChangingPassword)}
          >
            {isChangingPassword ? "Cancel" : "Change Password"}
          </Button>
        </div>

        {isChangingPassword && (
          <form
            onSubmit={handlePasswordSubmit(onChangePassword)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Current Password"
                type="password"
                {...registerPassword("currentPassword", {
                  required: "Current password is required",
                })}
                error={passwordErrors.currentPassword?.message}
              />

              <Input
                label="New Password"
                type="password"
                {...registerPassword("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                error={passwordErrors.newPassword?.message}
              />

              <Input
                label="Confirm New Password"
                type="password"
                {...registerPassword("confirmPassword", {
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
                error={passwordErrors.confirmPassword?.message}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(false);
                  resetPassword();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={passwordLoading}>
                Update Password
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Account Statistics */}
      <div className="pt-8 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Account Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-primary-600">
              {user?.MetaApps?.length || 0}
            </div>
            <div className="text-sm text-primary-700">Connected Apps</div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {user?.MetaAccounts?.filter((acc: any) => acc.isActive).length ||
                0}
            </div>
            <div className="text-sm text-green-700">Active Accounts</div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {user?.MetaAccounts?.reduce(
                (acc: any, account: any) =>
                  acc + (account.currency === "USD" ? 1 : 0),
                0
              ) || 0}
            </div>
            <div className="text-sm text-blue-700">USD Accounts</div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-8 border-t border-gray-200">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-900 mb-2">Danger Zone</h3>
          <p className="text-sm text-red-700 mb-4">
            These actions are irreversible. Please be careful.
          </p>

          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50"
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to disconnect all Meta accounts? This action cannot be undone."
                  )
                ) {
                  // TODO: Implement disconnect all accounts
                  console.log("Disconnect all accounts");
                }
              }}
            >
              Disconnect All Accounts
            </Button>

            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to delete your account? This action cannot be undone and will delete all your data."
                  )
                ) {
                  // TODO: Implement account deletion
                  console.log("Delete account");
                }
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
