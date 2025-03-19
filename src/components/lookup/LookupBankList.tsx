
import { LookupManager } from "./LookupManager";
import { useBankList } from "@/hooks/lookup/use-bank-list";

export const LookupBankList = () => {
  const { banks, isLoading, addBank, updateBank, deleteBank } = useBankList();

  return (
    <LookupManager
      title="Bank List"
      items={banks}
      isLoading={isLoading}
      fields={[
        { name: "bank_name", label: "Bank Name", required: true },
        { name: "bank_code", label: "Bank Code" },
      ]}
      onAdd={addBank}
      onUpdate={updateBank}
      onDelete={deleteBank}
      displayField="bank_name"
    />
  );
};
