import cloneDeep from 'lodash/cloneDeep';
import { computed, defineComponent, ref, toRaw, watch } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    ['update:modelValue']() {
      return true;
    },
    ['change']() {
      return true;
    },
  },
  setup(props, { emit }) {
    const state = ref(cloneDeep(toRaw(props.modelValue)));
    watch(
      () => props.modelValue,
      () => {
        state.value = cloneDeep(toRaw(props.modelValue));
      }
    );

    function getCopy() {
      const fields = props.columns.map((it) => it.field);

      return cloneDeep(
        toRaw(
          state.value.map((row) => {
            return fields.reduce((result, field) => {
              result[field] = row[field];
              return result;
            }, {});
          })
        )
      );
    }

    function addRow(index) {
      const emptyRow = props.columns.reduce((row, column) => {
        row[column.field] = column.default?.() ?? undefined;
        return row;
      }, {});

      state.value.splice(index, 0, emptyRow);
      updateTableData();
    }

    function removeRow(index) {
      state.value.splice(index, 1);
      updateTableData();
    }

    function updateTableData() {
      emit('update:modelValue', getCopy());
      emit('change', getCopy());
    }

    const finalColumns = computed(() => {
      const columns = cloneDeep(toRaw(props.columns));
      const readOnly = props.readOnly;

      if (!readOnly) {
        columns.push({
          header: '操作',
          field: 'operation',
          cellRender(row, rowIndex) {
            return (
              <div style="display: flex; gap: 0.5rem">
                <d-button onClick={() => removeRow(rowIndex)} variant="text" color="primary" size="sm">
                  删除
                </d-button>
                <d-button onClick={() => addRow(rowIndex)} variant="text" color="primary" size="sm">
                  添加一行
                </d-button>
              </div>
            );
          },
        });
      }

      return columns.map((column) => {
        return {
          ...column,
          cellRender(row, rowIndex) {
            if (column.cellRender) {
              return column.cellRender(row, rowIndex);
            }

            if (readOnly) {
              return <span>{state.value[rowIndex][column.field] || '- -'}</span>;
            }

            return <d-input v-model={state.value[rowIndex][column.field]} onChange={updateTableData} />;
          },
        };
      });
    });

    return () => {
      return (
        <d-data-grid
          style="height:500px"
          data={state.value}
          columns={finalColumns.value}
          v-slots={{
            empty() {
              return (
                <div style="padding: 2rem; display: flex; justify-content: center">
                  <div>无数据</div>
                  {props.readOnly ? null : (
                    <div>
                      <d-button onClick={() => addRow(0)}>+1</d-button>
                    </div>
                  )}
                </div>
              );
            },
          }}
        />
      );
    };
  },
});
