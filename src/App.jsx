import { defineComponent, ref } from 'vue';
import AEditableTable from './AEditableTable';

export default defineComponent({
  setup(props, { emit }) {
    const tableData = ref([{ action: 'edit', fileName: 'xxx.java', filePath: 'a/bbb/ccc/ddd/xxx.java' }]);
    const startEdit = ref(false);

    const columns = [
      { header: '操作', field: 'action' },
      { header: '文件名称', field: 'fileName' },
      { header: '路径', field: 'filePath' },
      { header: '描述', field: 'description' },
    ];

    function change() {
      console.table(tableData.value);
    }

    return () => (
      <div>
        <d-button
          size="sm"
          onClick={() => {
            startEdit.value = !startEdit.value;
          }}
        >
          {startEdit.value ? '完成' : '编辑'}
        </d-button>
        <div style="width: 800px; border: 1px solid #ccc">
          <AEditableTable v-model={tableData.value} columns={columns} onChange={change} readOnly={!startEdit.value} />
        </div>
      </div>
    );
  },
});
