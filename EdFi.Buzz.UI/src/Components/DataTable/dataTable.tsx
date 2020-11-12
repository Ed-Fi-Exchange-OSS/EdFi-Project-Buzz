// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as React from 'react';

import styled from 'styled-components';

const StyledDataTable = styled.table`
  border: none !important;
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1rem;
  color: var(--slate-gray);

  & > .h2-desktop {
    margin-bottom: 3em;
  }

  & thead tr th {
    text-align: inherit;
    background-color: var(--slate-gray) !important;
    color: var(--white) !important;
  }

  & tbody tr td {
    background-color: var(--iron) !important;
  }

  & tbody tr:nth-of-type(odd) td {
    background-color: var(--white) !important;
  }

  .col-highlight {
    font-weight: 800;
    color: var(--shark);
  }

  .row-highlight {
    border-bottom-color: var(--sea-buckthorn1);
    border-bottom-style: solid;
    border-bottom-width: 2px;
  }

  & > td > a,
  & > th > a {
    color: var(--denim);
    :hover {
      color: var(--sea-buckthorn1) !important;
    }
  }

  & td,
  & th {
    padding: 0.75rem;
    vertical-align: top;
    border: none !important;
  }

  & thead th {
    vertical-align: bottom;
    :hover {
      cursor: pointer;
    }
  }

  @media (max-width: 767.98px) {
    .table-responsive-md > .table-bordered {
      border: 0;
    }
  }

  .text-center {
    text-align: center !important;
  }

  @media print {
    border-collapse: collapse !important;
    thead {
      display: table-header-group;
    }
    tr {
      page-break-inside: avoid;
    }

    td {
      background-color: var(--white) !important;
    }
  }

  & > thead > tr > th {
    height: 10px;
    padding: 8px;
  }
  .verticle-middle th,
  td {
    vertical-align: middle;
  }

  &.first-td-left th:first-child,
  &.first-td-left td:first-child {
    text-align: left;
  }

  &.dataTable td,
  &.dataTable th {
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
  }
  &.dataTable td.dataTables_empty,
  &.dataTable th.dataTables_empty {
    text-align: center;
  }
  &.dataTable.nowrap th,
  &.dataTable.nowrap td {
    white-space: nowrap;
  }
  &.dataTable thead > tr > th.sorting_asc,
  &.dataTable thead > tr > th.sorting_desc,
  &.dataTable thead > tr > th.sorting,
  &.dataTable thead > tr > td.sorting_asc,
  &.dataTable thead > tr > td.sorting_desc,
  &.dataTable thead > tr > td.sorting {
    padding-right: 30px;
  }
  &.dataTable thead > tr > th:active,
  &.dataTable thead > tr > td:active {
    outline: none;
  }
  &.dataTable thead .sorting,
  &.dataTable thead .sorting_asc,
  &.dataTable thead .sorting_desc,
  &.dataTable thead .sorting_asc_disabled,
  &.dataTable thead .sorting_desc_disabled {
    cursor: pointer;
    position: relative;
  }
  &.dataTable thead .sorting:before,
  &.dataTable thead .sorting:after,
  &.dataTable thead .sorting_asc:before,
  &.dataTable thead .sorting_asc:after,
  &.dataTable thead .sorting_desc:before,
  &.dataTable thead .sorting_desc:after,
  &.dataTable thead .sorting_asc_disabled:before,
  &.dataTable thead .sorting_asc_disabled:after,
  &.dataTable thead .sorting_desc_disabled:before,
  &.dataTable thead .sorting_desc_disabled:after {
    position: absolute;
    bottom: 0.9em;
    display: block;
    opacity: 0.3;
  }
`;

export interface ColumnOption {
  label: string;
  hide?: boolean;
  linkColumnIndex?: number;
}

function isColumnOption(column: string | ColumnOption): column is ColumnOption {
  return column && typeof column === 'object' && 'label' in column;
}

export interface SortOption {
  columnIndex: number;
  desc: boolean;
}

function convertToSortOption(sortBy: number | SortOption, desc?: boolean): SortOption {
  if (!sortBy) {
    return null;
  }
  if (typeof sortBy === 'object' && 'columnIndex' in sortBy) {
    return sortBy;
  }
  return { columnIndex: sortBy, desc: desc != null ? desc : false };
}

export interface FilterOptions {
  columnIndex: number;
  filter: string;
}

export interface DataTableComponentProps {
  columns: string[] | ColumnOption[];
  dataSet: string[][];
  defaultSort?: number | SortOption;
  alwaysSortLastByColumn?: number | SortOption;
  linkBaseURL?: string;
  filterByColumn?: FilterOptions;
  highlightFilterByColumn?: FilterOptions;
}

export const DataTable: React.FunctionComponent<DataTableComponentProps> = (props: DataTableComponentProps) => {
  const [sortByColIndex, setSortByColIndex] = React.useState(null as number);
  const [sortDirection, sortDirectionDispatch] = React.useReducer(
    (state, action) => {
      switch (action) {
        case 'toggle':
          return { Descending: !state.Descending };
        case 'reset':
          return { Descending: false };
        default:
          throw new Error('Action is not one of toggle, reset');
      }
    },
    { Descending: false }
  );

  function compareColumns(a: string[], b: string[], sortOption: SortOption) {
    if (!sortOption) {
      return 0;
    }
    let compare: number;
    if (sortOption && a[sortOption.columnIndex] > b[sortOption.columnIndex]) {
      compare = 1;
    } else if (sortOption && a[sortOption.columnIndex] < b[sortOption.columnIndex]) {
      compare = -1;
    } else {
      compare = 0;
    }
    return (
      compare  * (sortOption.desc ? -1 : 1)
    );
  }

  const sortedDataset = props.dataSet
    .filter((row) => {
      if (!props.filterByColumn) {
        return true;
      }
      return row[props.filterByColumn.columnIndex] === props.filterByColumn.filter;
    })
    .sort((a, b) => {
      const sortByCol = convertToSortOption(sortByColIndex, sortDirection.Descending);
      const currentSortBy = sortByCol || convertToSortOption(props.defaultSort);

      const firstColSort = compareColumns(a, b, currentSortBy);
      if (firstColSort !== 0) {
        return firstColSort;
      }

      const alwaysSortLastByColumn = convertToSortOption(props.alwaysSortLastByColumn);
      return compareColumns(a, b, alwaysSortLastByColumn);
    });

  function sortByEventHandler(colIndex: number) {
    if (sortByColIndex !== colIndex) {
      setSortByColIndex(colIndex);
      sortDirectionDispatch('reset');
    } else {
      sortDirectionDispatch('toggle');
    }
  }

  return (
    <StyledDataTable
      lang='en'
      style={{ hyphens: 'auto' }}
      className='full-survey-table table table-bordered table-striped verticle-middle text-center first-td-left dataTable'
    >
      <thead>
        <tr>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(props.columns as any).map((column, index) => {
            let label: string;
            if (typeof column === 'string') {
              label = column;
            }
            if (isColumnOption(column)) {
              label = column.label;
              if (column.hide === true) {
                return null;
              }
            }
            return (
              <th
                onClick={() => sortByEventHandler(index)}
                onKeyPress={(event) => event.key === 'Enter' ? sortByEventHandler(index) : null}
                className={
                  (index !== sortByColIndex ? 'sorting ' : '') +
                  (index === sortByColIndex && !sortDirection.Descending ? 'sorting_asc ' : '') +
                  (index === sortByColIndex && sortDirection.Descending ? 'sorting_desc' : '')
                }
                key={label}
                tabIndex={3}
              >
                {label}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {sortedDataset.map((row) => (
          <tr
            key={row.join('-')}
            className={
              props.highlightFilterByColumn &&
              row[props.highlightFilterByColumn.columnIndex] === props.highlightFilterByColumn.filter
                ? 'row-highlight'
                : ''
            }
          >
            {row.map((column, colIdx) => {
              const labelColumn = props.columns[colIdx];

              if (isColumnOption(labelColumn) && labelColumn.hide === true) {
                return null;
              }

              return (
                <td
                  key={row.join('-') + colIdx}
                  className={
                    props.highlightFilterByColumn &&
                    row[props.highlightFilterByColumn.columnIndex] === props.highlightFilterByColumn.filter &&
                    colIdx === props.highlightFilterByColumn.columnIndex
                      ? 'col-highlight'
                      : ''
                  }
                >
                  {isColumnOption(labelColumn) && labelColumn.linkColumnIndex >= 0 ? (
                    <a tabIndex={3} href={`${props.linkBaseURL}${row[labelColumn.linkColumnIndex]}`}>{column}</a>
                  ) : (
                    <>{column}</>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </StyledDataTable>
  );
};
