import {
  CaretUpOutlined,
  CaretDownOutlined
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import 'styles/column-two-sort.less'

interface ColumnTwoSortProps {
  sortItem?: SortProps,
  sortOne: SortProps,
  sortTwo: SortProps,
  clear: boolean,
  comSortClick: (sortOrder: SortOrder | null, key: string) => void,
}
interface ColumnSortProps {
  sortItem: SortProps,
  comItemSortClick: (sortItem: SortProps) => void,
}
interface SortProps {
  name: string,  
  key: string,  
  showSorterTooltip?: boolean,  
  sortDirections?: SortOrder[], 
  sorter?: boolean, 
  sortOrder?: SortOrder | null, 
  singleSort?: boolean,  
}
export default function ColumnTwoSort({ sortOne, sortTwo, clear, comSortClick }: ColumnTwoSortProps) {
  const arr1 = {
    name: sortOne.name,
    key: sortOne.key,
    showSorterTooltip: sortOne.showSorterTooltip === undefined || sortOne.showSorterTooltip === null ? true : false,
    sortDirections: sortOne.sortDirections && sortOne.sortDirections.length > 0 ? sortOne.sortDirections : ['descend', 'ascend'] as SortOrder[],
    sorter: sortOne.sorter,
    sortOrder: sortOne.sortOrder || null,
    singleSort: sortOne.singleSort ? true : false
  }
  const arr2 = {
    name: sortTwo.name,
    key: sortTwo.key,
    showSorterTooltip: sortTwo.showSorterTooltip === undefined || sortTwo.showSorterTooltip === null ? true : false,
    sortDirections: sortTwo.sortDirections && sortTwo.sortDirections.length > 0 ? sortTwo.sortDirections : ['descend', 'ascend'] as SortOrder[],
    sorter: sortTwo.sorter,
    sortOrder: sortTwo.sortOrder || null,
    singleSort: sortTwo.singleSort ? true : false
  }
  useEffect(() => {
    if (clear) {
      setSort1(arr1)
      setSort2(arr2)
    }
  }, [clear])

  const [sort1, setSort1] = useState(arr1)

  const [sort2, setSort2] = useState(arr2)
  const sortItemClick = (item: SortProps, name: string) => {
    if (name == 'sort1') {
      comSortClick(item.sortOrder as SortOrder, sort1.key)
      setSort1({
        ...sort1,
        sorter: item.sorter,
      })
      setSort2(arr2)
    } else {
      comSortClick(item.sortOrder as SortOrder, sort2.key)
      setSort2({
        ...sort2,
        sorter: item.sorter,
      })
      setSort1(arr1)
    }
  }
  return (
    <div className='columnTwoSort'>
      <SortItem sortItem={sort1} comItemSortClick={(val) => { sortItemClick(val, 'sort1') }} />
      /
      <SortItem sortItem={sort2} comItemSortClick={(val) => { sortItemClick(val, 'sort2') }} />
    </div>
  )
}

function SortItem({ sortItem, comItemSortClick }: ColumnSortProps) {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });

  const [sort, setSort] = useState({
    name: sortItem.name,
    key: sortItem.key,
    showSorterTooltip: sortItem.showSorterTooltip,
    sortDirections: sortItem.sortDirections || ['descend', 'ascend'],
    sorter: sortItem.sorter,
    sortOrder: sortItem.sortOrder || null,
    singleSort: sortItem.singleSort
  })
  const [sortDesc, setSortDesc] = useState(sortItem.sortDirections?.length == 1 || sort.sortDirections[0] == 'descend' ? f('definderSortDescend') : f('definderSortAscend'));

  const SortIcon = ({ param }: { param: SortOrder[] }) => {
    if (param) {
      const sortOrder = sort.sortOrder;
      if (param.length > 1) {
        return (
          <>
            <CaretUpOutlined className='sortIcon upIcon' style={{ color: sortOrder == 'ascend' ? '#7477dd' : '#bfbfbf' }} />
            <CaretDownOutlined className='sortIcon downIcon' style={{ color: sortOrder == 'descend' ? '#7477dd' : '#bfbfbf' }} />
          </>
        )
      } else {
        if (param[0] == 'ascend') {
          return (
            <CaretUpOutlined className='sortIcon upIcon singleUp' style={{ color: sortOrder == 'ascend' ? '#7477dd' : '#bfbfbf' }} />
          )
        } else {
          return (
            <CaretDownOutlined className='sortIcon downIcon singleDown' style={{ color: sortOrder == 'descend' ? '#7477dd' : '#bfbfbf' }} />
          )
        }
      }
    } else {
      return null
    }
  }
  useEffect(() => {
    const sortOrder = sort.sortOrder;
    if (sort.sortDirections.length > 1) {
      setSortDesc(!sortOrder ? f('definderSortDescend') : sortOrder == 'ascend' ? f('definderSortCancel') : f('definderSortAscend'))
    } else {
      if (sort.sortDirections[0] == 'ascend') {
        setSortDesc(!sortOrder ? f('definderSortAscend') : f('definderSortCancel'))
      } else {
        setSortDesc(!sortOrder ? f('definderSortDescend') : f('definderSortCancel'))
      }
    }
  }, [sort.sortOrder])
  useEffect(() => {
    if (!sortItem.sorter) {
      setSort({ ...sort, sortOrder: null })
    }
  }, [sortItem.sorter])
  const SortClick = () => {
    const sortOrder = sort.sortOrder;
    console.log(sort);
    
    if (sort.sortDirections.length > 1) {
      setSort({ ...sort, sorter: sortOrder && sortOrder == 'ascend' ? false : true, sortOrder: !sortOrder ? 'descend' : sortOrder == 'ascend' ? null : 'ascend' })
      comItemSortClick({ ...sort, sorter: sortOrder && sortOrder == 'ascend' ? false : true, sortOrder: !sortOrder ? 'descend' : sortOrder == 'ascend' ? null : 'ascend' })
    } else {
      if (sort.sortDirections[0] == 'ascend') {
        if (!sort.singleSort) {
          setSort({ ...sort, sorter: !sortOrder ? true : false, sortOrder: 'ascend' })
          comItemSortClick({ ...sort, sorter: !sortOrder ? true : false, sortOrder: 'ascend' })
        } else {
          setSort({ ...sort, sorter: !sortOrder ? true : false, sortOrder: !sortOrder ? 'ascend' : null })
          comItemSortClick({ ...sort, sorter: !sortOrder ? true : false, sortOrder: !sortOrder ? 'ascend' : null })
        }
      } else {
        if (!sort.singleSort) {
          setSort({ ...sort, sorter: !sortOrder ? true : false, sortOrder: 'descend' })
          comItemSortClick({ ...sort, sorter: !sortOrder ? true : false, sortOrder: 'descend' })
        } else {
          setSort({ ...sort, sorter: !sortOrder ? true : false, sortOrder: !sortOrder ? 'descend' : null })
          comItemSortClick({ ...sort, sorter: !sortOrder ? true : false, sortOrder: !sortOrder ? 'descend' : null })
        }
      }
    }
  }
  return (
    <>
      {
        sort.showSorterTooltip ?
          <Tooltip placement="top" title={sortDesc}>
            <span onClick={() => { SortClick() }} className="spanBox">
              {f(sort.name)}
              <span className='spanBoxC'>
                <span className='spanBoxS'>
                  <SortIcon param={sort.sortDirections} />
                </span>
              </span>
            </span>
          </Tooltip>
          :
          <span onClick={() => { SortClick() }} className="spanBox">
            {f(sort.name)}
            <span className='spanBoxC'>
              <span className='spanBoxS'>
                <SortIcon param={sort.sortDirections} />
              </span>
            </span>
          </span>
      }
    </>
  )
}