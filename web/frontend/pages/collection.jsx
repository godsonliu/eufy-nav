import {
  Page,
  Layout,
  LegacyCard,
  LegacyStack,
  VerticalStack,
  Tag,
  Badge,
  Text,
  Button,
  Modal,
  Form,
  FormLayout,
  TextField,
  Select,
  ChoiceList,
  Frame,
  Toast,
  Icon,
} from "@shopify/polaris";
import { CircleMinusMajor } from "@shopify/polaris-icons";
import { useState, useCallback, useEffect } from "react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import "../assets/collection.css";

export default function Collection() {
  const [collection, setCollection] = useState([]);
  const [id, setID] = useState();

  const [handle, setHandle] = useState();
  const [handles, setHandles] = useState([]);
  const [filters, setFilters] = useState([]);
  const [excludes, setExcludes] = useState([]);
  const [options, setOptions] = useState([
    {
      label: "",
      value: "",
      link: "",
      checked: false,
    },
  ]);

  const [filtersIndex, setFiltersIndex] = useState();
  const [handleIndex, setHandleIndex] = useState();
  const [filterIndex, setFilterIndex] = useState();
  const [excludeIndex, setExcludeIndex] = useState();
  const [isFiltersEdit, setIsFiltersEdit] = useState(false);
  const [isHandleEdit, setIsHandleEdit] = useState(false);
  const [isFilterEdit, setIsFilterEdit] = useState(false);
  const [isExcludeEdit, setIsExcludeEdit] = useState(false);

  const [modal, setModal] = useState(false);
  const [handleModal, setHandleModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [excludeModal, setExcludeModal] = useState(false);
  const [source, setSource] = useState("tag");
  const [type, setType] = useState("checkbox");
  const [excludeHandle, setExcludeHandle] = useState();
  const [excludeFilters, setExcludeFilters] = useState([]);
  const [excludeHandleOptions, setHandleExcludeOptions] = useState([]);
  const [excludeFilterOptions, setExcludeFilterOptions] = useState([]);

  const [title, setTitle] = useState();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [tip, setTip] = useState("");
  const [sourceOptions, setSourceOptions] = useState([]);

  const handleSourceChange = useCallback((value) => setSource(value), []);
  const handleTitleChange = useCallback((value) => setTitle(value), []);

  const Close = ({ ...props }) => {
    return (
      <svg
        {...props}
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
      >
        <path d="M512 992A480.512 480.512 0 0 1 32 512 480.512 480.512 0 0 1 512 32a480.512 480.512 0 0 1 480 480 480.512 480.512 0 0 1-480 480z m0-434.624l135.68 135.68a32 32 0 0 0 22.72 9.344 32 32 0 0 0 22.528-9.344 32 32 0 0 0 9.344-22.592 32 32 0 0 0-9.344-22.656L557.184 511.936l135.744-135.68a32 32 0 0 0 9.472-22.784 31.488 31.488 0 0 0-9.472-22.464 31.552 31.552 0 0 0-22.656-9.472 31.552 31.552 0 0 0-22.656 9.472L511.936 466.88 376.064 331.008a31.552 31.552 0 0 0-22.656-9.472 31.488 31.488 0 0 0-22.592 9.472 32 32 0 0 0 0 45.248l135.872 135.68-135.872 135.872a31.168 31.168 0 0 0-9.344 22.464 31.616 31.616 0 0 0 9.344 22.72 32 32 0 0 0 22.656 9.344A32 32 0 0 0 376 692.992l135.872-135.68z"></path>
      </svg>
    );
  };

  useEffect(() => {
    if (!modal) return;
    let start, end, node;
    const dragStart = (e) => {
      let index = e.target.getAttribute("data-index");
      if (index) {
        start = parseInt(index);
      }
    };
    const dragEnter = (e) => {
      if (
        e.target.nodeName === "BUTTON" &&
        e.target.classList.contains("Polaris-Tag")
      ) {
        node?.classList.remove("moving");
        node = e.target.parentNode;
        let index = node.getAttribute("data-index");
        end = parseInt(index);
        if (start !== end) {
          node.classList.add("moving");
        }
      }
      e.preventDefault();
    };
    const dragOver = (e) => {
      e.preventDefault();
    };
    const dragEnd = (e) => {
      if (node.classList.contains("handle")) {
        setHandles((prev) => {
          if (end > start) {
            prev.splice(end + 1, 0, prev[start]);
            prev.splice(start, 1);
          } else {
            prev.splice(end, 0, prev[start]);
            prev.splice(start + 1, 1);
          }
          return prev.slice();
        });
      }
      if (node.classList.contains("filter")) {
        setFilters((prev) => {
          if (end > start) {
            prev.splice(end + 1, 0, prev[start]);
            prev.splice(start, 1);
          } else {
            prev.splice(end, 0, prev[start]);
            prev.splice(start + 1, 1);
          }
          return prev.slice();
        });
      }
      if (node.classList.contains("exclude")) {
        setExcludes((prev) => {
          if (end > start) {
            prev.splice(end + 1, 0, prev[start]);
            prev.splice(start, 1);
          } else {
            prev.splice(end, 0, prev[start]);
            prev.splice(start + 1, 1);
          }
          return prev.slice();
        });
      }
      node.classList.remove("moving");
    };
    let elements = [
      document.querySelector(".dragHandle"),
      document.querySelector(".dragFilter"),
      document.querySelector(".dragExclude"),
    ];
    elements.forEach((item) => {
      item?.addEventListener("dragstart", dragStart);
      item?.addEventListener("dragenter", dragEnter);
      item?.addEventListener("dragover", dragOver);
      item?.addEventListener("dragend", dragEnd);
    });
    return () => {
      elements.forEach((item) => {
        item?.removeEventListener("dragstart", dragStart);
        item?.removeEventListener("dragenter", dragEnter);
        item?.removeEventListener("dragover", dragOver);
        item?.removeEventListener("dragend", dragEnd);
      });
    };
  }, [modal]);

  useEffect(() => {
    if (!isExcludeEdit) {
      let _handles = handles.filter((handle) => {
        let flag = true;
        excludes.forEach((item) => {
          if (item.handle === handle) {
            flag = false;
          }
        });
        return flag;
      });
      setHandleExcludeOptions(_handles);
    } else {
      setHandleExcludeOptions(handles);
    }
  }, [handles, isExcludeEdit, excludes]);

  useEffect(() => {
    let _filters = filters.map((item) => {
      return {
        label: item.title,
        value: item.id,
      };
    });
    setExcludeFilterOptions(_filters);
  }, [filters]);

  useEffect(() => {
    let options = [
      {
        label: "tag",
        value: "tag",
      },
      {
        label: "price",
        value: "price",
      },
      {
        label: "offers",
        value: "offers",
      },
      {
        label: "category",
        value: "category",
      },
    ];
    if (!isFilterEdit) {
      options = options.filter((item) => {
        let flag = true;
        filters.forEach((filter) => {
          if (filter.source === item.value && item.value !== "tag") {
            flag = false;
          }
        });
        return flag;
      });
    }
    setSourceOptions(options);
  }, [filters, isFilterEdit]);

  const fetch = useAuthenticatedFetch();

  const addHandle = () => {
    if (!handle) return;
    setHandles((prev) => {
      if (isHandleEdit) {
        prev[handleIndex] = handle;
      } else {
        prev.push(handle);
      }
      return prev.slice();
    });
    setHandleModal(false);
    setModal(true);
  };

  const addFilter = () => {
    let _options = JSON.parse(JSON.stringify(options));
    let _type = type;
    if (source === "category") {
      _type = "category";
      _options = _options.map((item) => {
        return {
          label: item.label,
          link: item.link,
        };
      });
    } else {
      _options = _options.map((item) => {
        return {
          label: item.label,
          value: item.value,
          checked: false,
        };
      });
    }
    let filter = {
      title,
      id: title,
      type: _type,
      source,
      open: true,
      value: "",
      options: _options,
    };
    setFilters((prev) => {
      if (isFilterEdit) {
        prev[filterIndex] = filter;
      } else {
        prev.push(filter);
      }
      return prev.slice();
    });
    setFilterModal(false);
    setModal(true);
  };

  const addExclude = () => {
    if (excludeHandleOptions.length) {
      let _excludes = {
        handle: excludeHandle || excludeHandleOptions[0],
        filter: excludeFilters,
      };
      setExcludes((prev) => {
        if (isExcludeEdit) {
          prev[excludeIndex] = _excludes;
        } else {
          prev.push(_excludes);
        }
        return prev.slice();
      });
    }
    setExcludeModal(false);
    setModal(true);
  };

  const addFilters = () => {
    let _collection = JSON.parse(JSON.stringify(collection));
    if (isFiltersEdit) {
      _collection.filters[filtersIndex] = {
        filter: filters,
        handle: handles,
        excludes,
      };
    } else {
      _collection.filters.push({
        filter: filters,
        handle: handles,
        excludes,
      });
    }
    setCollection(_collection);
    setLoading(true);
    fetch("/api/metafield", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        value: JSON.stringify(_collection),
        type: "json",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        let tip = setIsFiltersEdit ? "修改成功" : "添加成功";
        setTip(tip);
        setToast(true);
        setModal(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleLabelChange = (val, index) => {
    setOptions((prev) => {
      prev[index].label = val;
      prev[index].value = val;
      prev[index].link = val;
      return prev.slice();
    });
  };

  const handleValueChange = (val, index) => {
    setOptions((prev) => {
      prev[index].value = val;
      prev[index].link = val;
      return prev.slice();
    });
  };

  useAppQuery({
    url:
      "/api/metafield?" +
      new URLSearchParams({
        namespace: "global",
        key: "collection_v3",
      }),
    reactQueryOptions: {
      onSuccess: (data) => {
        let _collections = JSON.parse(data[0].value);
        setID(data[0].id);
        setCollection(_collections);
      },
    },
  });
  return (
    <Frame>
      <Page
        primaryAction={
          <Button
            primary
            onClick={() => {
              setIsFiltersEdit(false);
              setHandles([]);
              setFilters([]);
              setExcludes([]);
              setModal(true);
            }}
          >
            添加
          </Button>
        }
      >
        <Layout>
          <Layout.Section>
            {collection.filters?.map((item, index) => (
              <LegacyCard
                sectioned
                title={`筛选条件${index + 1}`}
                key={index}
                actions={[
                  {
                    content: "编辑",
                    onAction: () => {
                      setIsFiltersEdit(true);
                      setFiltersIndex(index);
                      setHandles(item.handle);
                      setFilters(item.filter);
                      setExcludes(item.excludes);
                      setModal(true);
                    },
                  },
                ]}
              >
                <VerticalStack gap="5">
                  <LegacyStack>
                    <Text variant="bodyMd" as="span">
                      handle:
                    </Text>
                    {item.handle.map((v, i) => (
                      <Badge status="info" key={i}>
                        {v}
                      </Badge>
                    ))}
                  </LegacyStack>
                  <LegacyStack>
                    <Text variant="bodyMd" as="span">
                      filter:
                    </Text>
                    {item.filter?.map((v, i) => (
                      <Tag key={i}>{v.title}</Tag>
                    ))}
                  </LegacyStack>
                  <LegacyStack>
                    <Text variant="bodyMd" as="span">
                      exclude:
                    </Text>
                    {item.excludes?.map((v, i) => (
                      <Tag key={i}>{v.handle}</Tag>
                    ))}
                  </LegacyStack>
                </VerticalStack>
              </LegacyCard>
            ))}
          </Layout.Section>
        </Layout>
        <Modal
          open={modal}
          onClose={() => setModal(false)}
          title="筛选条件"
          primaryAction={{
            content: "保存",
            onAction: addFilters,
            loading,
          }}
        >
          <Modal.Section>
            <LegacyCard sectioned>
              <div className="dragHandle">
                <LegacyStack alignment="center">
                  {handles.map((handle, index) => (
                    <div
                      className="handle"
                      draggable
                      key={index}
                      data-index={index}
                    >
                      <Tag
                        key={index}
                        onClick={() => {
                          setHandleIndex(index);
                          setIsHandleEdit(true);
                          setHandle(handle);
                          setModal(false);
                          setHandleModal(true);
                        }}
                      >
                        {handle}
                        <Close
                          className="close"
                          onClick={(e) => {
                            setHandles((prev) => {
                              prev.splice(index, 1);
                              return prev.slice();
                            });
                            setExcludes((prev) => {
                              let exclude = prev.filter((item) => {
                                return item.handle !== handle;
                              });
                              return exclude;
                            });
                            e.stopPropagation();
                          }}
                        />
                      </Tag>
                    </div>
                  ))}

                  <Button
                    size="slim"
                    onClick={() => {
                      setIsHandleEdit(false);
                      setHandle("");
                      setModal(false);
                      setHandleModal(true);
                    }}
                  >
                    添加handle
                  </Button>
                </LegacyStack>
              </div>
            </LegacyCard>
            <LegacyCard sectioned>
              <div className="dragFilter">
                <LegacyStack alignment="center">
                  {filters.map((filter, index) => (
                    <div
                      className="filter"
                      draggable
                      key={index}
                      data-index={index}
                    >
                      <Tag
                        key={index}
                        onClick={() => {
                          setFilterIndex(index);
                          setIsFilterEdit(true);
                          setSource(filter.source);
                          setTitle(filter.title);
                          setType(filter.type);
                          setOptions(filter.options);
                          setModal(false);
                          setFilterModal(true);
                        }}
                      >
                        {filter.title}
                        <Close
                          className="close"
                          onClick={(e) => {
                            setFilters((prev) => {
                              prev.splice(index, 1);
                              return prev.slice();
                            });
                            setExcludes((prev, i) => {
                              let exclude = prev.map((item) => {
                                let excludeFilter = item.filter;
                                let j = excludeFilter.indexOf(filter.id);
                                if (j > -1) {
                                  excludeFilter.splice(j, 1);
                                }
                                return {
                                  handle: item.handle,
                                  filter: excludeFilter,
                                };
                              });
                              exclude = exclude.filter((item) => {
                                return item.filter.length > 0;
                              });
                              return exclude;
                            });
                            e.stopPropagation();
                          }}
                        />
                      </Tag>
                    </div>
                  ))}
                  <Button
                    size="slim"
                    onClick={() => {
                      setIsFilterEdit(false);
                      setSource("tag");
                      setTitle("");
                      setType("checkbox");
                      setOptions([
                        {
                          label: "",
                          value: "",
                          link: "",
                          checked: false,
                        },
                      ]);
                      setModal(false);
                      setFilterModal(true);
                    }}
                  >
                    添加filter
                  </Button>
                </LegacyStack>
              </div>
            </LegacyCard>
            {handles.length > 0 && filters.length > 0 && (
              <LegacyCard sectioned>
                <div className="dragExclude">
                  <LegacyStack alignment="center">
                    {excludes.map((exclude, index) => (
                      <div
                        className="exclude"
                        draggable
                        key={index}
                        data-index={index}
                      >
                        <Tag
                          key={index}
                          onClick={() => {
                            setExcludeIndex(index);
                            setIsExcludeEdit(true);
                            setExcludeHandle(exclude.handle);
                            setExcludeFilters(exclude.filter);
                            setModal(false);
                            setExcludeModal(true);
                          }}
                        >
                          {exclude.handle}
                          <Close
                            className="close"
                            onClick={(e) => {
                              setExcludes((prev) => {
                                let _excludes = JSON.parse(
                                  JSON.stringify(prev)
                                );
                                _excludes.splice(index, 1);
                                return _excludes;
                              });
                              e.stopPropagation();
                            }}
                          />
                        </Tag>
                      </div>
                    ))}
                    {excludeHandleOptions.length > 0 && (
                      <Button
                        size="slim"
                        onClick={() => {
                          setIsExcludeEdit(false);
                          setExcludeHandle("");
                          setExcludeFilters([]);
                          setModal(false);
                          setExcludeModal(true);
                        }}
                      >
                        添加exclude
                      </Button>
                    )}
                  </LegacyStack>
                </div>
              </LegacyCard>
            )}
          </Modal.Section>
        </Modal>
        <Modal
          open={handleModal}
          onClose={() => {
            setHandleModal(false);
            setModal(true);
          }}
          title="handle"
          primaryAction={{
            content: "保存",
            onAction: addHandle,
          }}
        >
          <Modal.Section>
            <Form>
              <FormLayout>
                <TextField value={handle} onChange={setHandle} />
              </FormLayout>
            </Form>
          </Modal.Section>
        </Modal>
        <Modal
          open={filterModal}
          onClose={() => {
            setFilterModal(false);
            setModal(true);
          }}
          title="filter"
          primaryAction={{
            content: "保存",
            onAction: addFilter,
          }}
        >
          <Modal.Section>
            <Form>
              <FormLayout>
                <Select
                  label="类型"
                  disabled={isFilterEdit}
                  options={sourceOptions}
                  onChange={handleSourceChange}
                  value={source}
                />
                <TextField
                  label="标题"
                  value={title}
                  onChange={handleTitleChange}
                />
                {source != "category" && (
                  <ChoiceList
                    title="是否多选"
                    choices={[
                      { label: "是", value: "checkbox" },
                      { label: "否", value: "radio" },
                    ]}
                    selected={type}
                    onChange={setType}
                  />
                )}
                <LegacyCard
                  sectioned
                  title="选项"
                  actions={[
                    {
                      content: "添加选项",
                      onAction: () => {
                        setOptions((prev) => {
                          prev.push({
                            label: "",
                            value: "",
                            link: "",
                            checked: false,
                          });
                          return prev.slice();
                        });
                      },
                    },
                  ]}
                >
                  <FormLayout>
                    {options.map((item, index) => (
                      <div className="options-wrap" key={index}>
                        <FormLayout.Group>
                          <TextField
                            placeholder="选项名称"
                            value={item.label}
                            onChange={(e) => handleLabelChange(e, index)}
                          />
                          <TextField
                            placeholder={
                              source === "price"
                                ? "如：>200.00、99.99-199.99、<99.99等"
                                : "匹配值"
                            }
                            value={item.value || item.link}
                            onChange={(val) => handleValueChange(val, index)}
                          />
                          {options.length > 1 && (
                            <div
                              onClick={() => {
                                setOptions((prev) => {
                                  prev.splice(index, 1);
                                  return prev.slice();
                                });
                              }}
                            >
                              <Icon source={CircleMinusMajor} color="base" />
                            </div>
                          )}
                        </FormLayout.Group>
                      </div>
                    ))}
                  </FormLayout>
                </LegacyCard>
              </FormLayout>
            </Form>
          </Modal.Section>
        </Modal>
        <Modal
          open={excludeModal}
          onClose={() => {
            setExcludeModal(false);
            setModal(true);
          }}
          title="exclude"
          primaryAction={{
            content: "保存",
            onAction: addExclude,
          }}
        >
          <Modal.Section>
            <Form>
              <FormLayout>
                <Select
                  label="handle"
                  disabled={isExcludeEdit}
                  options={excludeHandleOptions}
                  onChange={setExcludeHandle}
                  value={excludeHandle}
                />
                <ChoiceList
                  title="filter"
                  allowMultiple
                  choices={excludeFilterOptions}
                  selected={excludeFilters}
                  onChange={setExcludeFilters}
                />
              </FormLayout>
            </Form>
          </Modal.Section>
        </Modal>
        {toast && (
          <Toast
            content={tip}
            onDismiss={() => {
              setToast(false);
            }}
          />
        )}
      </Page>
    </Frame>
  );
}
