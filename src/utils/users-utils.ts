import { Profile } from "@/types/auth";
import { supabase } from "@/lib/supabase";

export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Profile[];
};

export const deleteUsers = async (userIds: string[]) => {
  const { error } = await supabase
    .from("profiles")
    .delete()
    .in("id", userIds);

  if (error) throw error;
};

export const exportUsersToCSV = (users: Profile[]) => {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    "Full Name,Email,User Type,Created At\n" +
    users
      .map((user) =>
        [
          user.full_name,
          user.email,
          user.user_type,
          new Date(user.created_at).toLocaleDateString(),
        ].join(",")
      )
      .join("\n");

  return encodeURI(csvContent);
};