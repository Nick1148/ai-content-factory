"use client";

import { useState, useCallback } from "react";
import PaperCard from "@/components/PaperCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import AdSlot from "@/components/AdSlot";
import { PaperExplanation, ArxivCategory } from "@/lib/types";

interface PapersFeedProps {
  papers: PaperExplanation[];
  categories: ArxivCategory[];
  papersByDate: Record<string, PaperExplanation[]>;
  sortedDates: string[];
}

export default function PapersFeed({ papers, categories, papersByDate, sortedDates }: PapersFeedProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // 필터링된 논문
  const filteredPapers = papers.filter((paper) => {
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(paper.category);
    const matchesSearch =
      searchQuery === "" ||
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.tldr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // 필터링된 날짜별 그룹핑
  const filteredByDate: Record<string, PaperExplanation[]> = {};
  for (const paper of filteredPapers) {
    const date = paper.publishedDate;
    if (!filteredByDate[date]) {
      filteredByDate[date] = [];
    }
    filteredByDate[date].push(paper);
  }

  const filteredDates = Object.keys(filteredByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <>
      <div className="mb-6 space-y-4">
        <SearchBar onSearch={handleSearch} />
        <CategoryFilter categories={categories} onFilterChange={setSelectedCategories} />
      </div>

      {filteredDates.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            검색 조건에 맞는 논문이 없습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredDates.map((date, dateIndex) => (
            <div key={date}>
              <h3 className="mb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                {new Date(date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <div className="space-y-4">
                {filteredByDate[date].map((paper) => (
                  <PaperCard key={paper.id} paper={paper} />
                ))}
              </div>
              {/* 날짜 그룹 사이에 광고 슬롯 배치 (첫 번째 이후 매 2번째 그룹) */}
              {dateIndex > 0 && dateIndex % 2 === 0 && (
                <AdSlot className="mt-6" />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
