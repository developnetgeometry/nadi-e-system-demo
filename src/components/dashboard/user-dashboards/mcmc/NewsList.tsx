import React from "react";
import { FileText } from "lucide-react";

interface NewsItemProps {
  title: string;
  date: string;
}

const NewsItem = ({ title, date }: NewsItemProps) => {
  return (
    <div className="news-item">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
          <FileText size={20} />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-white">{title}</h4>
        {date && <p className="text-xs text-gray-400 mt-1">{date}</p>}
      </div>
    </div>
  );
};

interface NewsListProps {
  news: NewsItemProps[];
}

const NewsList = ({ news }: NewsListProps) => {
  return (
    <div className="card-dashboard animate-fade-in">
      <div className="p-4 border-b border-gray-700/50">
        <h3 className="text-lg font-medium text-white">Latest News</h3>
      </div>
      <div>
        {news.map((item, index) => (
          <NewsItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default NewsList;
