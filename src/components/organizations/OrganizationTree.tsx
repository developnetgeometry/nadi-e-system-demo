
import { useState, useMemo } from "react";
import { Organization } from "@/types/organization";
import { ChevronDown, ChevronRight, Building, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeNode {
  org: Organization;
  children: TreeNode[];
}

interface OrganizationTreeProps {
  organizations: Organization[];
  onSelect: (organization: Organization) => void;
}

export function OrganizationTree({ organizations, onSelect }: OrganizationTreeProps) {
  // Build tree data structure
  const tree = useMemo(() => {
    const buildTree = () => {
      const organizationMap = new Map<string, TreeNode>();
      
      // Initialize all orgs as nodes with empty children arrays
      organizations.forEach(org => {
        organizationMap.set(org.id, { org, children: [] });
      });
      
      // Root nodes (those with no parent)
      const rootNodes: TreeNode[] = [];
      
      // Connect children to parents
      organizations.forEach(org => {
        const node = organizationMap.get(org.id);
        if (!node) return;
        
        if (org.parent_id && organizationMap.has(org.parent_id)) {
          // This has a parent, add it to parent's children
          const parentNode = organizationMap.get(org.parent_id);
          parentNode?.children.push(node);
        } else {
          // No parent, it's a root node
          rootNodes.push(node);
        }
      });
      
      return rootNodes;
    };
    
    return buildTree();
  }, [organizations]);

  return (
    <div className="rounded-md border p-4 max-h-[400px] overflow-auto">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Layers className="h-5 w-5 text-primary" />
        Organization Hierarchy
      </h3>
      <div className="space-y-1">
        {tree.map((node) => (
          <TreeNodeComponent
            key={node.org.id}
            node={node}
            level={0}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

interface TreeNodeComponentProps {
  node: TreeNode;
  level: number;
  onSelect: (organization: Organization) => void;
}

function TreeNodeComponent({ node, level, onSelect }: TreeNodeComponentProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  
  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-1 p-1 rounded-sm cursor-pointer hover:bg-muted",
          "transition-colors duration-200"
        )}
        style={{ paddingLeft: `${level * 16 + 4}px` }}
        onClick={() => onSelect(node.org)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="h-5 w-5 flex items-center justify-center text-muted-foreground"
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <span className="w-5" />
        )}
        
        <Building className={cn(
          "h-4 w-4",
          node.org.type === "dusp" ? "text-blue-500" : "text-green-500"
        )} />
        
        <span className="truncate">{node.org.name}</span>
        <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-muted-foreground/20 text-muted-foreground uppercase">
          {node.org.type}
        </span>
      </div>
      
      {expanded && hasChildren && (
        <div className="pl-2">
          {node.children.map((childNode) => (
            <TreeNodeComponent
              key={childNode.org.id}
              node={childNode}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
