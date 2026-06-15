<template>
  <div class="admin-view">
    <div class="header-actions">
      <h2>Groups</h2>
      <button class="scale-button admin-action-btn" @click="openCreateModal">Create Group</button>
    </div>

    <el-table class="admin-table" :data="groups" style="width: 100%" v-loading="loading" border stripe>
      <el-table-column prop="groupName" label="Group Name" align="center" min-width="120" />
      <el-table-column prop="edupageClassId" label="Edupage Class ID" align="center" min-width="150" />
      <el-table-column label="Actions" align="center" min-width="180">
        <template #default="scope">
          <el-button size="small" @click="openEditModal(scope.row)">Edit</el-button>
          <el-popconfirm title="Are you sure to delete this group?" @confirm="deleteGroup(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger">Delete</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog for Create / Edit -->
    <el-dialog custom-class="admin-dialog" :title="isEdit ? 'Edit Group' : 'Create Group'" v-model="dialogVisible" width="90%">
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="Group Name" prop="groupName">
          <el-input v-model="form.groupName" />
        </el-form-item>
        <el-form-item label="Edupage Class ID" prop="edupageClassId">
          <el-input-number v-model="form.edupageClassId" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveGroup" :loading="saving">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

export default {
  name: 'AdminGroupsView',
  setup() {
    const store = useStore();
    const groups = ref([]);
    const loading = ref(false);
    const dialogVisible = ref(false);
    const isEdit = ref(false);
    const saving = ref(false);
    const formRef = ref(null);

    const form = reactive({
      id: null,
      groupName: '',
      edupageClassId: null
    });

    const rules = {
      groupName: [{ required: true, message: 'Please input group name', trigger: 'blur' }],
      edupageClassId: [{ required: true, message: 'Please input edupage class id', trigger: 'blur' }]
    };

    const getAuthHeaders = () => {
      const token = localStorage.getItem(store.getters['User/GET_JWT_LKEY']);
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      };
    };

    const fetchGroups = async () => {
      loading.value = true;
      try {
        const response = await fetch(`${store.getters['GET_URL']}/groups/all`, {
          headers: getAuthHeaders()
        });
        if (response.ok) {
          groups.value = await response.json();
        } else {
          ElMessage.error('Failed to fetch groups');
        }
      } catch (e) {
        ElMessage.error('Error fetching groups');
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchGroups();
    });

    const openCreateModal = () => {
      isEdit.value = false;
      form.id = null;
      form.groupName = '';
      form.edupageClassId = null;
      dialogVisible.value = true;
    };

    const openEditModal = (row) => {
      isEdit.value = true;
      form.id = row.id;
      form.groupName = row.groupName;
      form.edupageClassId = row.edupageClassId;
      dialogVisible.value = true;
    };

    const deleteGroup = async (id) => {
      try {
        const response = await fetch(`${store.getters['GET_URL']}/groups/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (response.ok) {
          ElMessage.success('Group deleted successfully');
          fetchGroups();
        } else {
          ElMessage.error('Failed to delete group');
        }
      } catch (e) {
        ElMessage.error('Error deleting group');
      }
    };

    const saveGroup = async () => {
      if (!formRef.value) return;
      const valid = await formRef.value.validate().catch(() => false);
      if (valid) {
        saving.value = true;
        try {
          const url = isEdit.value 
            ? `${store.getters['GET_URL']}/groups/${form.id}`
            : `${store.getters['GET_URL']}/groups`;
          const method = isEdit.value ? 'PUT' : 'POST';
          const bodyData = isEdit.value 
            ? { groupId: form.id, groupName: form.groupName, edupageClassId: form.edupageClassId }
            : { groupName: form.groupName, edupageClassId: form.edupageClassId };

          const response = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(bodyData)
          });

          if (response.ok) {
            ElMessage.success(isEdit.value ? 'Group updated successfully' : 'Group created successfully');
            dialogVisible.value = false;
            fetchGroups();
          } else {
            ElMessage.error('Failed to save group');
          }
        } catch (e) {
          ElMessage.error('Error saving group');
        } finally {
          saving.value = false;
        }
      }
    };

    return {
      groups,
      loading,
      dialogVisible,
      isEdit,
      saving,
      form,
      formRef,
      rules,
      openCreateModal,
      openEditModal,
      deleteGroup,
      saveGroup
    };
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/buttons.scss';
</style>
