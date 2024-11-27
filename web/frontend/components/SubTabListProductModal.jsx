import { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Icon,
  Button,
  Modal,
  Form,
  FormLayout,
  TextField,
} from "@shopify/polaris";
import { CirclePlusMinor, CircleMinusMinor } from "@shopify/polaris-icons";
import { cloneDeep } from "lodash";

const updateNestedTabs = (
  headerSetting,
  subTabListEditIndex,
  subTabListProductsEditIndex,
  subTabListCategoryEditIndex,
  tabListProducts
) => {
  return headerSetting.map((item, index) => {
    if (index !== subTabListEditIndex) return item;

    const { tabs = [] } = item;
    const updatedTabs = tabs.map((tab, idx) => {
      if (idx !== subTabListProductsEditIndex) return tab;
      return {
        ...tab,
        tabs: tab?.tabs?.map((tabItem, i) =>
          i === subTabListCategoryEditIndex
            ? { ...tabItem, list: tabListProducts }
            : tabItem
        ),
      };
    });

    return {
      ...item,
      tabs: updatedTabs,
    };
  });
};

const SubTabListProductModal = ({
  subTabListEdit,
  onClose,
  headerSetting,
  onSave,
  subTabListEditIndex,
  subTabListProductsEditIndex = 0,
  subTabListCategoryEditIndex,
  selectedSubTabType,
}) => {
  const { control, handleSubmit, reset } = useForm({
    mode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tabListProducts",
  });

  useEffect(() => {
    if (!(headerSetting && !!headerSetting.length)) return;
    const headerSettingItem = headerSetting[subTabListEditIndex];
    const { tabs } = headerSettingItem;
    const tab = tabs?.[subTabListProductsEditIndex];
    const { list = [], tabs: subTabs = [] } = tab;
    if (selectedSubTabType === "tabs") {
      const subTab = subTabs?.[subTabListCategoryEditIndex];
      const { list: subTabList = [] } = subTab;
      const subTabTab = [];
      if (subTabList && Array.isArray(subTabList)) {
        subTabList.forEach((item) => subTabTab.push(item));
      }
      console.log(subTabTab, "subTabTab");
      reset({
        tabListProducts: subTabTab,
      });
    } else {
      const tabListProducts = [];
      if (list && Array.isArray(list)) {
        list.forEach((item) => tabListProducts.push(item));
      }
      console.log(tabListProducts, "tabListProducts");
      reset({
        tabListProducts: tabListProducts,
      });
    }
  }, [
    headerSetting,
    subTabListEditIndex,
    subTabListProductsEditIndex,
    selectedSubTabType,
  ]);

  console.log(selectedSubTabType, "selectedSubTabType");

  return (
    <Modal
      title="products"
      large
      open={subTabListEdit}
      onClose={() => onClose && onClose()}
      primaryAction={{
        content: "确定",
        onAction: () => {
          handleSubmit((formData) => {
            console.log(formData, "formData");
            const { tabListProducts } = formData;
            let _headerSetting = cloneDeep(headerSetting);
            let result = [];
            if (selectedSubTabType === "list") {
              result = _headerSetting.map((item, index) => {
                if (subTabListEditIndex === index) {
                  const { tabs = [] } = item;
                  return {
                    ...item,
                    tabs: tabs?.map((tab, idx) =>
                      idx === subTabListProductsEditIndex
                        ? { ...tab, list: tabListProducts }
                        : tab
                    ),
                  };
                } else {
                  return item;
                }
              });
            } else if (selectedSubTabType === "tabs") {
              result = updateNestedTabs(
                _headerSetting,
                subTabListEditIndex,
                subTabListProductsEditIndex,
                subTabListCategoryEditIndex,
                tabListProducts
              );
            }
            onSave && onSave(result);
          })();
        },
      }}
      secondaryActions={{
        content: "取消",
        destructive: true,
        onAction: () => {
          onClose && onClose();
        },
      }}
    >
      <Modal.Section>
        <Form>
          <FormLayout>
            {fields?.length ? (
              fields?.map((field, index) => {
                return (
                  <FormLayout.Group condensed key={field.id}>
                    <Controller
                      render={({ field, fieldState }) => (
                        <TextField
                          required
                          label="title"
                          requiredIndicator
                          error={fieldState.error?.message}
                          {...field}
                        />
                      )}
                      rules={{
                        required: "This field is required",
                        validate: (value) =>
                          value.length <= 100 || "Max length is 100 characters", // 自定义校验
                      }}
                      // name={`${
                      //   selectedSubTabType === "list"
                      //     ? `tabListProducts.${index}.label`
                      //     : `tabListProducts.${index}.label`
                      // }`}
                      name={`tabListProducts.${index}.title`}
                      control={control}
                    />
                    <Controller
                      render={({ field }) => (
                        <TextField label="href" {...field} />
                      )}
                      name={`tabListProducts.${index}.href`}
                      control={control}
                    />
                    <Controller
                      render={({ field }) => (
                        <TextField label="tag" {...field} />
                      )}
                      name={`tabListProducts.${index}.tag`}
                      control={control}
                    />
                    <Controller
                      render={({ field }) => (
                        <TextField label="img" {...field} />
                      )}
                      name={`tabListProducts.${index}.img`}
                      control={control}
                    />
                    <div className="flex gap-4 h-full items-end pb-2">
                      <Button plain monochrome onClick={() => remove(index)}>
                        <Icon source={CircleMinusMinor}></Icon>
                      </Button>
                      {fields.length - 1 === index && (
                        <Button plain monochrome onClick={() => append()}>
                          <Icon source={CirclePlusMinor}></Icon>
                        </Button>
                      )}
                    </div>
                  </FormLayout.Group>
                );
              })
            ) : (
              <Button
                plain
                monochrome
                icon={CirclePlusMinor}
                onClick={() => append()}
              >
                Add
              </Button>
            )}
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  );
};

export default SubTabListProductModal;
