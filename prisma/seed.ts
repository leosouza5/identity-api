import { prisma } from "@/config/prismaClient.js"
import argon2 from "argon2"

async function seed() {
  await prisma.role.createMany({
    data: [
      {
        name: "SUPER_ADMIN",
        description: "Full access to the system, including critical settings, users, permissions, and auditing.",
      },
      {
        name: "ADMIN",
        description: "Manages users, roles, and administrative system settings.",
      },
      {
        name: "SUPPORT",
        description: "Provides technical support with permission to view data and assist users.",
      },
      {
        name: "OPS",
        description: "Responsible for system operations, monitoring, and execution of operational tasks.",
      },
      {
        name: "AUDITOR",
        description: "Read-only access for auditing system data and logs.",
      },
      {
        name: "USER",
        description: "Standard system user with access to basic functionalities.",
      },
      {
        name: "GUEST",
        description: "Limited access, typically for temporary or view-only usage.",
      },
    ],
  })

  await prisma.permission.createMany({
    data: [
      {
        key: "user:create",
        description: "Allows creating new users in the system.",
      },
      {
        key: "user:read",
        description: "Allows viewing user information.",
      },
      {
        key: "user:update",
        description: "Allows updating user information.",
      },
      {
        key: "user:delete",
        description: "Allows deleting users from the system.",
      },
      {
        key: "user:suspend",
        description: "Allows suspending a user account.",
      },
      {
        key: "user:unsuspend",
        description: "Allows reactivating a suspended user account.",
      },
      {
        key: "role:create",
        description: "Allows creating new roles.",
      },
      {
        key: "role:read",
        description: "Allows viewing roles.",
      },
      {
        key: "role:update",
        description: "Allows updating roles.",
      },
      {
        key: "role:delete",
        description: "Allows deleting roles.",
      },
      {
        key: "role:sync_permissions",
        description: "Allows syncing role permissions.",
      },
      {
        key: "role:assign",
        description: "Allows assigning roles to users.",
      },
      {
        key: "permission:create",
        description: "Allows creating new permissions in the system.",
      },
      {
        key: "permission:read",
        description: "Allows viewing permissions.",
      },
      {
        key: "session:revoke",
        description: "Allows revoking active user sessions.",
      },
      {
        key: "audit:read",
        description: "Allows viewing audit logs and system activity records.",
      },
      {
        key: "job:read",
        description: "Allows viewing background jobs and their status.",
      },
      {
        key: "job:retry",
        description: "Allows retrying failed background jobs.",
      },
    ],
  })
  const passwordHash = await argon2.hash("password")

  const user = await prisma.user.create({
    data: {
      email: "user@test.com",
      name: "Test User",
      passwordHash: passwordHash,
    }
  })

  const superAdminRole = await prisma.role.findFirst({
    where: { name: "SUPER_ADMIN" },
  })

  await prisma.userRoles.create({
    data: {
      userId: user.id,
      roleId: superAdminRole!.id,
    },
  })
  const permissions = await prisma.permission.findMany()

  await Promise.all(
    permissions.map((permission) =>
      prisma.rolePermission.create({
        data: {
          roleId: superAdminRole!.id,
          permissionId: permission.id,
        },
      })
    )
  )
}

seed().then(() => {
  console.log("Database seeded!")
  prisma.$disconnect()
})
