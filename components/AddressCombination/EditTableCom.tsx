import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { ColumnType } from 'antd/lib/table/interface';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  [key: string]: number | string | boolean,
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {

  const [editing, setEditing] = useState(false);
  const inputRef = useRef<Input>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      //console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
      >
        <Input ref={inputRef} size="small" onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          minWidth: 50,
          minHeight: 24,
          display: 'flex',
          alignItems: 'center',
          wordBreak: 'break-all'
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  [key: string]: number | string | boolean,
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

interface ColumnTypeCom<T> extends ColumnType<T> {
  editable?: boolean
}
interface EditTableComProp<T> {
  state: T[],
  columns: ColumnTypeCom<T>[],
  handleSave: (item: T) => void
}
export default function EditTableCom<T>({
  state,
  columns,
  handleSave }: EditTableComProp<T>) {
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columnsItem = columns.map((col: ColumnTypeCom<T>) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: T) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });
  return (
    <div className="common-table" style={{ width: '100%', margin: 0 }}>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        dataSource={state as unknown as object[]}
        columns={columnsItem as ColumnTypes}
        pagination={false}
      />
    </div>
  );
}
