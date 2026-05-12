import { auth, clerkClient } from "@clerk/nextjs/server";
import { getTransactionsCount } from "../get-current-month-transactions";

export const canUserAddTransaction = async (month: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const user = (await clerkClient()).users.getUser(userId);
  if ((await user).publicMetadata.subscriptionPlan === "premium") {
    return true;
  }
  const currentMonthTransactions = await getTransactionsCount(month);
  if (currentMonthTransactions >= 10) {
    return false;
  }
  return true;
};
