import React from "react";

interface OperationItemProps {
  label: string;
  value: string;
  color: string;
}

interface OperationCardProps {
  title: string;
  items: OperationItemProps[];
}

const OperationItem = ({ label, value, color }: OperationItemProps) => {
  return (
    <div className="flex flex-col items-center">
      <span className={`text-sm ${color}`}>{label}</span>
      <span className="text-3xl font-bold text-white">{value}</span>
    </div>
  );
};

const OperationCard = ({ title, items }: OperationCardProps) => {
  return (
    <div className="card-dashboard animate-fade-in">
      <div className="p-4 border-b border-gray-700/50">
        <h3 className="text-lg font-medium text-white">{title}</h3>
      </div>
      <div className="p-4">
        <div className="flex justify-around">
          {items.map((item, index) => (
            <OperationItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperationCard;
