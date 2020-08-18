import * as React from 'react';

import './dataTable.css';
import { isRegExp } from 'util';


export interface ColumnOption {
  label: string;
  hide?: boolean;
  linkColumnIndex?: number;
}

function isColumnOption(column: any): column is ColumnOption {
  return column && typeof column === 'object' && 'label' in column;
}

export interface SortOption {
  columnIndex: number;
  desc: boolean;
}

function convertToSortOption(sortBy: number | SortOption, desc?: boolean): SortOption {
  if (!sortBy) { return null; }
  if (typeof sortBy === 'object' && 'columnIndex' in sortBy) { return sortBy; }
  return { columnIndex: sortBy, desc: desc != null ? desc : false };
}

export interface FilterOptions {
  columnIndex: number;
  filter: any;
}

export interface DataTableComponentProps {
  columns: string[] | ColumnOption[];
  dataSet: any[][];
  defaultSort?: number | SortOption;
  alwaysSortLastByColumn?: number | SortOption;
  linkBaseURL?: string;
  filterByColumn?: FilterOptions;
  highlightFilterByColumn?: FilterOptions;
}

export const DataTable: React.FunctionComponent<DataTableComponentProps> = (props: DataTableComponentProps) => {
  const [sortByColIndex, setSortByColIndex] = React.useState(null as number);
  const [sortDirection, sortDirectionDispatch] = React.useReducer((state, action) => {
    switch (action) {
      case 'toggle':
        return { Descending: !state.Descending };
      case 'reset':
        return { Descending: false };
      default:
        throw new Error('Action is not one of toggle, reset');
    }
  }, { Descending: false });

  const sortedDataset = props.dataSet
    .filter(row => {
      if (!props.filterByColumn) { return true; }
      return row[props.filterByColumn.columnIndex] === props.filterByColumn.filter;
    })
    .sort((a, b) => {
      const sortByCol = convertToSortOption(sortByColIndex, sortDirection.Descending);
      const currentSortBy = sortByCol ? sortByCol : convertToSortOption(props.defaultSort);

      const firstColSort = compareColumns(a, b, currentSortBy);
      if (firstColSort !== 0) { return firstColSort; }

      const alwaysSortLastByColumn = convertToSortOption(props.alwaysSortLastByColumn);
      return compareColumns(a, b, alwaysSortLastByColumn);
    });

  function compareColumns(a: any[], b: any[], sortOption: SortOption) {
    if (!sortOption) { return 0; }
    return (sortOption && a[sortOption.columnIndex] > b[sortOption.columnIndex] ? 1
      : sortOption && a[sortOption.columnIndex] < b[sortOption.columnIndex] ? -1
        : 0) * (sortOption.desc ? -1 : 1);
  }

  function sortByEventHandler(colIndex: number) {
    if (sortByColIndex !== colIndex) {
      setSortByColIndex(colIndex);
      sortDirectionDispatch('reset');
    } else {
      sortDirectionDispatch('toggle');
    }
  }

  return (
    <table lang='en' style={{ 'hyphens': 'auto' }} className='full-survey-table table table-bordered table-striped verticle-middle text-center first-td-left dataTable'>
      <thead>
        <tr>
          {(props.columns as any).map((column, index) => {
            let label: string;
            if (typeof column === 'string') { label = column; }
            if (isColumnOption(column)) {
              label = column.label;
              if (column.hide === true) { return null; }
            }
            return <th
              onClick={() => sortByEventHandler(index)}
              className={(index !== sortByColIndex ? 'sorting ' : '') +
                (index === sortByColIndex && !sortDirection.Descending ? 'sorting_asc ' : '') +
                (index === sortByColIndex && sortDirection.Descending ? 'sorting_desc' : '')}
              key={label}>
              {label}
            </th>;
          })}
        </tr>
      </thead>

      <tbody>
        {sortedDataset.map(row => <tr
          key={row.join('-')}
          className={props.highlightFilterByColumn
            && row[props.highlightFilterByColumn.columnIndex] === props.highlightFilterByColumn.filter
            ? 'row-highlight' : ''} >
          {row.map((column, colIdx) => {
            const labelColumn = props.columns[colIdx];

            if (isColumnOption(labelColumn) && labelColumn.hide === true) { return null; }

            return <td key={row.join('-') + colIdx}
              className={props.highlightFilterByColumn
                && row[props.highlightFilterByColumn.columnIndex] === props.highlightFilterByColumn.filter
                && colIdx === props.highlightFilterByColumn.columnIndex
                ? 'col-highlight' : ''
              }>
              {(isColumnOption(labelColumn) && labelColumn.linkColumnIndex >= 0)
                ? <a href={`${props.linkBaseURL}${row[labelColumn.linkColumnIndex]}`} >{column}</a>
                : <>{column}</>}
            </td>;
          })}
        </tr>)}
      </tbody>

    </table >
  );
};
