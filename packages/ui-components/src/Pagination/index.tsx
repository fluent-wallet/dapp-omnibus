import { useEffect, useId, type ComponentProps, type HTMLAttributes } from 'react';
import { machine, connect, type PublicApi } from '@zag-js/pagination';
import { useMachine, normalizeProps } from '@zag-js/react';

interface Props extends Omit<ComponentProps<'div'>, 'onChange' | 'children'> {
  id?: string;
  /**
   * Total number of data items
   */
  count: number;
  /**
   * Number of data items per page
   */
  pageSize: number;
  /**
   * Number of pages to show beside active page
   */
  siblingCount?: number;
  /**
   * The active page
   */
  page?: number;
  /**
   * Called when the page number is changed, and it takes the resulting page number argument
   */
  onChange?: (details: { page: number; pageSize: number; srcElement: HTMLElement | null }) => void;
  children?: (paginationProps: {
    rootProps: HTMLAttributes<HTMLElement>;
    prevPageTriggerProps: HTMLAttributes<HTMLElement>;
    nextPageTriggerProps: HTMLAttributes<HTMLElement>;
    getPageTriggerProps: PublicApi['getPageTriggerProps'];
    getEllipsisProps: PublicApi['getEllipsisProps'];
    pages: PublicApi['pages'];
    previousPage: number | null;
    page: number;
    nextPage: number | null;
    totalPages: number | null;
    pageRange: PublicApi['pageRange'];
    isFirstPage: boolean;
    isLastPage: boolean;
    setPage: (page: number) => void;
  }) => JSX.Element;
}

const Pagination: React.FC<Props> = ({ id, count, pageSize, siblingCount = 1, page, onChange, children, ...divProps }) => {
  const uniqueId = useId();
  const [state, send] = useMachine(machine({ id: id ?? uniqueId, count, pageSize, siblingCount, page, onChange }));
  const api = connect(state, send, normalizeProps);

  useEffect(() => {
    if (typeof page === 'number') {
      api.setPage(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div {...divProps}>
      {typeof children === 'function'
        ? children({
            rootProps: api.rootProps,
            prevPageTriggerProps: api.prevPageTriggerProps,
            nextPageTriggerProps: api.nextPageTriggerProps,
            getPageTriggerProps: api.getPageTriggerProps,
            getEllipsisProps: api.getEllipsisProps,
            pages: api.pages,
            previousPage: api.previousPage,
            page: api.page,
            nextPage: api.nextPage,
            totalPages: api.totalPages,
            pageRange: api.pageRange,
            isFirstPage: api.isFirstPage,
            isLastPage: api.isLastPage,
            setPage: api.setPage,
          })
        : null}
    </div>
  );
};

export default Pagination;
