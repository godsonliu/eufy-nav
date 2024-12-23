import { MenuTitle } from "./MenuTitle";
import { MenuList } from "./MenuList";
import { TabTitle } from "./TabTitle";
import { TabImage } from "./TabImage";
import { SubTab } from "./SubTab";
import { Poster } from "./Poster";
import { MoreTab } from "./MoreTab";
import {
  Button,
  Frame,
  Icon,
  List,
  Loading,
  Modal,
  Toast,
  Tooltip,
  Link,
  TextContainer,
} from "@shopify/polaris";
import { AlertMinor } from "@shopify/polaris-icons";
import { useState } from "react";
import { cloneDeep } from "lodash";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import "../assets/style.css";

export function Menus() {
  const [menus, setMenus] = useState([]);
  const [menuIndex, setMenuIndex] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [isDrag, setIsDrag] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [drag, setDrag] = useState(false);
  const [loadingDrag, setLoaingDrag] = useState(false);

  const fetch = useAuthenticatedFetch();

  useAppQuery({
    url:
      "/api/menus?" +
      new URLSearchParams({
        namespace: "new_nav",
      }),
    reactQueryOptions: {
      onSuccess: (data) => {
        setMenus(
          data
            ?.map((item) => {
              const value = JSON.parse(item.value);
              const description = JSON.parse(item.description);
              if (value.type && description.status === "Active") {
                return {
                  id: item.id,
                  index: value.index,
                  key: item.key,
                  value,
                };
              }
            })
            .filter((item) => {
              return !!item;
            })
            .sort((a, b) => {
              return a.index - b.index;
            })
        );
        setIsLoading(false);
      },
    },
  });

  const updateMenus = (metafields, cb) => {
    const newMenus = cloneDeep(menus);
    newMenus.map((item) => {
      if (item.id === metafields.id) {
        item.value = metafields.value;
      }
    });
    fetch("/api/menus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: metafields.id,
        value: JSON.stringify(metafields.value),
        type: "json",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        cb && cb();
        setMenus(newMenus);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dragStart = (i) => {
    console.log("start");
    setStart(i);
    setIsDrag(true);
    console.log(isDrag);
  };

  const dragOver = (i) => {
    setEnd(i);
  };

  const dragEnd = () => {
    console.log("end")
    /* if (end !== start) {
      setDrag(true);
    }
    setIsDrag(false);
    console.log(isDrag) */
  };

  const confirmDrag = () => {
    const menus = cloneDeep(metafields);
    console.log(menus);
    return;
    let parent = menus.value.children[indexs[0]];
    let item = parent.children;
    if (indexs.length > 1) {
      parent = item[indexs[1]];
      item = parent.children;
    }
    var s = item[start];
    item.splice(start, 1);
    item.splice(end, 0, s);
    item.forEach((tem, i) => {
      tem.id = tem.name = "img_" + (i + 1);
    });
    setLoaingDrag(true);
    updateMenus(menus, () => {
      setDrag(false);
      setLoaingDrag(false);
    });
  };
  const cancelDrag = () => {
    setDrag(false);
  };

  const DragModal = () => {
    return (
      <Modal
        open={drag}
        onClose={() => setDrag(false)}
        title="warnning"
        primaryAction={{
          content: "confirm",
          loading: loadingDrag,
          onAction: confirmDrag,
        }}
        secondaryActions={[
          {
            content: "cancel",
            onAction: cancelDrag,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>
              是否把第{start + 1}位内容移到第{end + 1}位
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    );
  };

  const TabBox = ({ metafields }) => {
    const data = metafields.value.children;
    return (
      <div className="data-tab">
        {data &&
          data.map((item, i) => {
            return (
              <div
                className={`data-tab-item ${tabIndex === i ? "active" : ""}`}
                key={i}
                onMouseEnter={() => setTabIndex(i)}
                // draggable
                // onDragStart={() => dragStart(i)}
                // onDragOver={() => dragOver(i)}
                // onDragEnd={() => dragEnd()}
              >
                <TabTitle
                  metafields={metafields}
                  updateMenus={updateMenus}
                  indexs={[i]}
                />
                {item.type === "poster" && !isDrag &&  (
                  <Poster
                    metafields={metafields}
                    updateMenus={updateMenus}
                    indexs={[i]}
                  />
                )}
                {item.type === "image" && !isDrag && (
                  <TabImage
                    metafields={metafields}
                    updateMenus={updateMenus}
                    indexs={[i]}
                  />
                )}
                {item.type === "tab" && !isDrag && (
                  <SubTab
                    metafields={metafields}
                    updateMenus={updateMenus}
                    indexs={[i]}
                  />
                )}
              </div>
            );
          })}
        <MoreTab
          metafields={metafields}
          updateMenus={updateMenus}
          indexs={[]}
        />
      </div>
    );
  };

  const MenuBox = ({ metafields }) => {
    const data = metafields.value.children;
    return (
      <div className="data-menu">
        {data &&
          data.map((item, i) => {
            return (
              <div className="data-menu-item" key={i}>
                <MenuTitle
                  metafields={metafields}
                  updateMenus={updateMenus}
                  indexs={[i]}
                />
                <MenuList
                  metafields={metafields}
                  updateMenus={updateMenus}
                  indexs={[i]}
                />
              </div>
            );
          })}
      </div>
    );
  };

  const Tip = () => {
    return (
      <List type="bullet">
        <List.Item>
          1.一级导航栏直接link跳转的部分, 无法同步, 仍需手动维护
        </List.Item>
        <List.Item>
          2.目前该功能只上线了US UK DE CA EU, 其他国家有需求, 可联系{" "}
          <Link url="mailto:godson.liu@anker-in.com">@Godson Liu</Link>{" "}
          进行手动同步
        </List.Item>
      </List>
    );
  };

  const sync = () => {
    setSyncLoading(true);
    fetch(
      "/api/menus?" +
        new URLSearchParams({
          namespace: "nav",
          key: "menu",
        })
    )
      .then((res) => res.json())
      .then((data) => {
        const value = [];
        const oldValue = JSON.parse(data[0].value);
        oldValue.forEach((item) => {
          if (item.type === "link") {
            value.push(item);
          }
        });
        const { id, type } = data[0];
        menus.forEach((item) => {
          value.push({
            title: item.key,
            type: item.value.type,
            lightColor: item.value.lightColor,
            children: item.value.children,
          });
        });

        fetch("/api/menus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            value: JSON.stringify(value).replace(/\"\s+http/g, '"http'),
            type,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setSyncLoading(false);
            setToast(true);
          });
      });
  };

  return (
    <Frame>
      {isLoading && <Loading />}
      <div id="app">
        <nav className="menus">
          {menus &&
            menus.map((item, i) => {
              return (
                <div
                  className={`menu-item ${menuIndex === i ? "active" : ""}`}
                  key={i}
                  onMouseEnter={() => {
                    setMenuIndex(i);
                    setTabIndex(0);
                  }}
                >
                  <span>{item.key}</span>
                  <div className="menu-item-box">
                    {item.value.type === "menu" && (
                      <MenuBox metafields={item} />
                    )}
                    {item.value.type === "tab" && <TabBox metafields={item} />}
                  </div>
                </div>
              );
            })}
        </nav>
        <div className="bottom">
          <Tooltip active={false} content={<Tip />}>
            <Icon source={AlertMinor} color="subdued" />
          </Tooltip>
          <Button primary loading={syncLoading} onClick={sync}>
            同步到无头
          </Button>
        </div>
        {toast && (
          <Toast content="同步成功" onDismiss={() => setToast(false)} />
        )}
      </div>
      <DragModal />
    </Frame>
  );
}
