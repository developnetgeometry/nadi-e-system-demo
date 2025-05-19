import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download, Database, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function DatabaseBackup() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [includeSchema, setIncludeSchema] = useState(true);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [tableInput, setTableInput] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleAddTable = () => {
    if (tableInput && !selectedTables.includes(tableInput)) {
      setSelectedTables([...selectedTables, tableInput]);
      setTableInput("");
    }
  };

  const handleRemoveTable = (table: string) => {
    setSelectedTables(selectedTables.filter((t) => t !== table));
  };

  const initiateBackup = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke(
        "backup-database",
        {
          body: {
            includeSchema,
            tables: selectedTables,
          },
        }
      );

      if (error) {
        throw error;
      }

      toast({
        title: "Backup initiated successfully",
        description:
          "Your backup is being processed and will be available for download shortly.",
      });

      if (data?.downloadUrl) {
        setDownloadUrl(data.downloadUrl);
      }
    } catch (error) {
      console.error("Backup error:", error);
      toast({
        title: "Backup failed",
        description:
          error.message || "An error occurred while initiating the backup",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database size={20} />
          Database Backup
        </CardTitle>
        <CardDescription>
          Create a backup of your Supabase database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="includeSchema"
            checked={includeSchema}
            onCheckedChange={(checked) => setIncludeSchema(!!checked)}
          />
          <Label htmlFor="includeSchema">Include database schema</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tables">Specific tables to include (optional)</Label>
          <div className="flex gap-2 mb-2">
            <Input
              id="tables"
              placeholder="Enter table name"
              value={tableInput}
              onChange={(e) => setTableInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddTable} type="button">
              Add
            </Button>
          </div>

          {selectedTables.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTables.map((table) => (
                <div
                  key={table}
                  className="bg-muted px-2 py-1 rounded-md flex items-center gap-1.5"
                >
                  <span className="text-sm">{table}</span>
                  <button
                    onClick={() => handleRemoveTable(table)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedTables.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Only these tables will be included in the backup. Leave empty to
              backup all tables.
            </p>
          )}
        </div>

        {downloadUrl && (
          <div className="bg-muted p-4 rounded-md mt-4">
            <p className="text-sm mb-2">Your backup is ready for download:</p>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => window.open(downloadUrl, "_blank")}
            >
              <Download size={16} />
              Download Backup
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={initiateBackup} disabled={loading} className="w-full">
          {loading ? (
            <>
              <RefreshCw size={16} className="mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Database size={16} className="mr-2" />
              Create Backup
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
