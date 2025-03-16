import { Fragment, useEffect, useRef, useState } from "react";
import PagerView from "react-native-pager-view";

type PagerFlatListProps<T> = {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  initialPage?: number;
  onPageSelected?: (pageIndex: number) => void;
  autoScrollInterval?: number;
  enableAutoScroll?: boolean;
};

export const Carousel = <T,>({
  data,
  renderItem,
  keyExtractor,
  initialPage = 0,
  onPageSelected,
  autoScrollInterval = 2000,
  enableAutoScroll = false,
}: PagerFlatListProps<T>) => {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isScrollPaused, setIsScrollPaused] = useState(false);
  useEffect(() => {
    if (!autoScrollInterval || data.length === 0) return;
    if (!enableAutoScroll) return;
    if (isScrollPaused) return;
    const interval = setInterval(() => {
      setCurrentPage((prevPage) => {
        const nextPage = (prevPage + 1) % data.length;
        pagerRef.current?.setPage(nextPage);
        return nextPage;
      });
    }, autoScrollInterval);
    return () => clearInterval(interval);
  }, [autoScrollInterval, data.length, isScrollPaused, enableAutoScroll]);

  return (
    <PagerView
      ref={pagerRef}
      initialPage={initialPage}
      onPageSelected={(e) => onPageSelected?.(e.nativeEvent.position)}
      style={{ width: "100%", height: "100%", padding: 0, margin: 0 }}
      onTouchStart={() => setIsScrollPaused(true)}
      onTouchEnd={() => setIsScrollPaused(false)}
    >
      {data.map((item, index) => (
        <Fragment
          key={keyExtractor ? keyExtractor(item, index) : index.toString()}
        >
          {renderItem(item, index)}
        </Fragment>
      ))}
    </PagerView>
  );
};
