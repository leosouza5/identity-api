import { prisma } from "@/config/prismaClient.js"

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
        key: "role:assign",
        description: "Allows assigning roles to users.",
      },
      {
        key: "permission:create",
        description: "Allows creating new permissions in the system.",
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

}

seed().then(() => {
  console.log("Database seeded!")
  prisma.$disconnect()
})