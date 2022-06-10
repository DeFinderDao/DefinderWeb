import { Button, Col, Dropdown, Input, Menu, message, Modal, Row, Upload } from "antd";
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useState } from "react";
import TextArea from "antd/lib/input/TextArea";
import { UploadFile } from "antd/lib/upload/interface";
import Storage, { KEY_USER_TOKEN } from 'utils/storage'
import { useEffect } from "react";
import { useIntl } from "react-intl";
import ApiClient from "utils/ApiClient";


export default function EllipsisMenu() {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const storage = new Storage()

  const ellipsisMenu = (
    <Menu>
      <Menu.Item key="website">
        <a className="menu-set-warning" target="_blank" href={process.env.SERVICES_ENV !== 'production' ? 'http://192.168.1.114:3001' : 'https://definder.info'}>
          <svg className="icon" aria-hidden="true" style={{ width: '16px', height: '16px', marginRight: '16px' }}>
            <use xlinkHref="#icon-ellipsis-website"></use>
          </svg>
          {f('ellipsisWebsite')}
        </a>
      </Menu.Item>
      <Menu.Item key="help">
        <a className="menu-set-warning" target="_blank" href="https://doc.definder.info/">
          <svg className="icon" aria-hidden="true" style={{ width: '16px', height: '16px', marginRight: '16px' }}>
            <use xlinkHref="#icon-ellipsis-help"></use>
          </svg>
          {f('ellipsisHelp')}
        </a>
      </Menu.Item>
      <Menu.Item key="suggestion">
        <div className="menu-set-warning" onClick={() => { setIsModalVisible(true) }}>
          <svg className="icon" aria-hidden="true" style={{ width: '16px', height: '16px', marginRight: '16px' }}>
            <use xlinkHref="#icon-ellipsis-suggestion"></use>
          </svg>
          {f('ellipsisSuggestion')}
        </div>
      </Menu.Item>
    </Menu>
  );
  const [isModalVisible, setIsModalVisible] = useState(false);


  const [query, setQuery] = useState({
    title: '',
    content: '',
  })
  const [requiredTitle, setRequiredTitle] = useState(false)
  const handleOk = () => {
    setRequiredTitle(false)
    if (!query.title) {
      setRequiredTitle(true)
      return
    }
    const status = fileList.map((item) => { return item.status })
    if (status.includes('uploading')) {
      return
    }
    const images = fileList.map((item) => { return item.response.data[0] })
    const apiClient = new ApiClient();
    apiClient.post('member/submit/bug', {
      data: {
        title: query.title.replace(/(^\s*)|(\s*$)/g, ""),
        content: query.content.replace(/(^\s*)|(\s*$)/g, ""),
        images
      }
    }).then(result => {
      if (result.code == 'success') {
        message.success(f('success'));
        setIsModalVisible(false);
        setQuery({
          title: '',
          content: '',
        })
        setFileList([])
      } else {
        message.error(result.message);
      }
    })
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setQuery({
      title: '',
      content: '',
    })
    setFileList([])
  };

  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const handlePreviewCancel = () => {
    setPreviewVisible(false)
    setPreviewImage('')
  };

  const handlePreview = async (file: UploadFile) => {
    if (file.status == 'done') {
      if (file.url) {
        setPreviewImage(file.url as string)
      } else {
        setPreviewImage(file.response.data[0])
      }
    } else {
      setPreviewImage(file.thumbUrl as string)
    }
  };
  useEffect(() => {
    if (previewImage) {
      setPreviewVisible(true)
    }
  }, [previewImage])

  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList)
  };

  return (
    <>
      <Dropdown overlay={ellipsisMenu} placement="bottomRight"
        overlayClassName="set-warning-overlay" arrow>
        <div className="ellipsis-outlined">
          <EllipsisOutlined />
        </div>
      </Dropdown>
      <Modal
        visible={isModalVisible}
        forceRender
        onCancel={handleCancel}
        width={590}
        style={{ top: 20 }}
        footer={null}>
        <p className="modal-title">
          {f('ellipsisSuggestion')}
        </p>
        <div>
          <Row style={{ marginBottom: requiredTitle ? 0 : 16 }}>
            <Col span={4} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}>
              {f('ellipsisTitle')}：
            </Col>
            <Col span={20}>
              <Input
                placeholder={f('ellipsisTitlePlaceholder')}
                value={query.title}
                onChange={(e) => {
                  if (e.target.value.replace(/(^\s*)|(\s*$)/g, "")) {
                    setRequiredTitle(false)
                  } else {
                    setRequiredTitle(true)
                  }
                  setQuery({
                    ...query,
                    title: e.target.value,
                  })
                }}
                maxLength={50}
                style={{ width: '100%', paddingRight: 45 }} />
              <span className="ellipsis-text-num">{query.title.replace(/(^\s*)|(\s*$)/g, "").length}/50</span>
            </Col>
          </Row>
        </div>
        {requiredTitle ? <div>
          <Row style={{ marginBottom: 16 }}>
            <Col span={4} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}>
            </Col>
            <Col span={20}>
              <span style={{ color: '#a61d24' }}>{f('ellipsisRequiredTitle')}</span>
            </Col>
          </Row>
        </div> : null}
        <div>
          <Row style={{ marginBottom: 16 }}>
            <Col span={4} style={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              {f('ellipsisDesc')}：
            </Col>
            <Col span={20}>
              <TextArea
                placeholder={f('ellipsisDescPlaceholder')}
                value={query.content}
                onChange={(e) => {
                  setQuery({
                    ...query,
                    content: e.target.value,
                  })
                }}
                maxLength={500}
                style={{ width: '100%', height: 150, paddingBottom: 25 }} />
              <span className="ellipsis-text-num">{query.content.replace(/(^\s*)|(\s*$)/g, "").length}/500</span>
            </Col>
          </Row>
        </div>

        <Row style={{ marginBottom: 16 }}>
          <Col span={4} style={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            {f('ellipsisImg')}：
          </Col>
          <Col span={20}>
            <Upload
              accept='image/*'
              action="/api/upload/document"
              listType="picture-card"
              headers={{ 'Authorization': storage.get(KEY_USER_TOKEN) }}
              className="ellipsis-img-box"
              fileList={fileList}
              multiple
              maxCount={8}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {
                fileList.length < 8 ?
                  <span>
                    <svg className="icon" aria-hidden="true" style={{ width: 50, height: 50 }}>
                      <use xlinkHref="#icon-upload-img"></use>
                    </svg>
                  </span>
                  :
                  null
              }
            </Upload>
          </Col>
        </Row>
        <div className="form-btns">
          <Button type="primary" onClick={handleOk}>
            {f('ellipsisSub')}
          </Button>
        </div>
      </Modal>
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={handlePreviewCancel}
      >
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}