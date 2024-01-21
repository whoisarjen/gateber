'use client'

import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type PaginationLinkProps = {
  count: number
}

export const PaginationLink = ({
  count
}: PaginationLinkProps) => {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('strona') ?? '1', 10)

  return (
    <Pagination
      page={page}
      count={count}
      renderItem={(item) => (
        <PaginationItem
          component={(props: any) => <Link {...props} href={`/wpisy${item.page === 1 ? '' : `?strona=${item.page}`}`} />}
          {...item}
        />
      )}
    />
  );
}
