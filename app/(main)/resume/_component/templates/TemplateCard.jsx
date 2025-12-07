"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Edit } from "lucide-react";

export const TemplateCard = ({ template, onEdit, loading }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
      <div
        className={`p-6 rounded-t-xl bg-gradient-to-br ${template.color} text-white min-h-[200px] flex flex-col justify-between`}
      >
        <div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">{template.name}</h3>
            {template.popular && (
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-0"
              >
                <Star className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>
          <p className="text-white/90 text-sm mb-4">{template.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {template.features.map((feature, index) => (
            <span
              key={index}
              className="text-xs bg-white/20 px-2 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-b-xl">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600 capitalize">
            {template.category}
          </span>
          <Button
            onClick={() => onEdit(template)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Edit className="h-4 w-4 mr-2" />
            )}
            {loading ? "Loading..." : "Use Template"}
          </Button>
        </div>
      </div>
    </div>
  );
};
