<template>
  <div class="admin-view">
    <div class="header-actions">
      <h2>Courses</h2>
      <div class="actions-right">
        <el-select class="admin-select-filter" v-model="selectedGroupFilter" placeholder="Filter by Group" clearable @change="fetchCourses">
          <el-option
            v-for="group in groups"
            :key="group.id"
            :label="group.groupName"
            :value="group.id"
          />
        </el-select>
        <button class="scale-button admin-action-btn" @click="openCreateModal">Create Course</button>
      </div>
    </div>

    <el-table class="admin-table" :data="courses" style="width: 100%" v-loading="loading" border stripe>
      <el-table-column prop="courseName" label="Course Name" align="center" min-width="160" />
      <el-table-column prop="semester" label="Semester" align="center" min-width="120">
        <template #default="scope">
          {{ scope.row.semester === 1 ? 'Fall' : 'Winter' }}
        </template>
      </el-table-column>
      <el-table-column prop="hours" label="Hours" align="center" min-width="100" />
      <el-table-column prop="groupName" label="Group" align="center" min-width="120" />
      <el-table-column label="Actions" align="center" min-width="180">
        <template #default="scope">
          <el-button size="small" @click="openEditModal(scope.row)">Edit</el-button>
          <el-popconfirm title="Are you sure to delete this course?" @confirm="deleteCourse(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger">Delete</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog for Create / Edit -->
    <el-dialog custom-class="admin-dialog" :title="isEdit ? 'Edit Course' : 'Create Course'" v-model="dialogVisible" width="90%">
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="Course Name" prop="courseName">
          <el-input v-model="form.courseName" />
        </el-form-item>
        <el-form-item label="Semester" prop="semester">
          <el-select class="admin-select-full" v-model="form.semester" placeholder="Select semester">
            <el-option label="Fall (1)" :value="1" />
            <el-option label="Winter (2)" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="Hours" prop="hours">
          <el-input-number v-model="form.hours" :min="1" />
        </el-form-item>
        <el-form-item label="Group" prop="groupId">
          <el-select class="admin-select-full" v-model="form.groupId" placeholder="Select group" filterable>
            <el-option
              v-for="group in groups"
              :key="group.id"
              :label="group.groupName"
              :value="group.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveCourse" :loading="saving">Confirm</el-button>
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
  name: 'AdminCoursesView',
  setup() {
    const store = useStore();
    const courses = ref([]);
    const groups = ref([]);
    const loading = ref(false);
    const dialogVisible = ref(false);
    const isEdit = ref(false);
    const saving = ref(false);
    const formRef = ref(null);
    const selectedGroupFilter = ref(null);

    const form = reactive({
      id: null,
      courseName: '',
      semester: null,
      hours: null,
      groupId: null
    });

    const rules = {
      courseName: [{ required: true, message: 'Please input course name', trigger: 'blur' }],
      semester: [{ required: true, message: 'Please select semester', trigger: 'change' }],
      hours: [{ required: true, message: 'Please input hours', trigger: 'blur' }],
      groupId: [{ required: true, message: 'Please select a group', trigger: 'change' }]
    };

    const getAuthHeaders = () => {
      const token = localStorage.getItem(store.getters['User/GET_JWT_LKEY']);
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      };
    };

    const fetchGroups = async () => {
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
      }
    };

    const fetchCourses = async () => {
      loading.value = true;
      try {
        let url = `${store.getters['GET_URL']}/courses`;
        if (selectedGroupFilter.value) {
          url += `?groupId=${selectedGroupFilter.value}`;
        }
        const response = await fetch(url, {
          headers: getAuthHeaders()
        });
        if (response.ok) {
          courses.value = await response.json();
        } else {
          ElMessage.error('Failed to fetch courses');
        }
      } catch (e) {
        ElMessage.error('Error fetching courses');
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      await fetchGroups();
      fetchCourses();
    });

    const openCreateModal = () => {
      isEdit.value = false;
      form.id = null;
      form.courseName = '';
      form.semester = null;
      form.hours = null;
      form.groupId = selectedGroupFilter.value || null;
      dialogVisible.value = true;
    };

    const openEditModal = (row) => {
      isEdit.value = true;
      form.id = row.id;
      form.courseName = row.courseName;
      form.semester = row.semester;
      form.hours = row.hours;
      form.groupId = row.groupId;
      dialogVisible.value = true;
    };

    const deleteCourse = async (id) => {
      try {
        const response = await fetch(`${store.getters['GET_URL']}/courses/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (response.ok) {
          ElMessage.success('Course deleted successfully');
          fetchCourses();
        } else {
          ElMessage.error('Failed to delete course');
        }
      } catch (e) {
        ElMessage.error('Error deleting course');
      }
    };

    const saveCourse = async () => {
      if (!formRef.value) return;
      const valid = await formRef.value.validate().catch(() => false);
      if (valid) {
        saving.value = true;
        try {
          const url = isEdit.value 
            ? `${store.getters['GET_URL']}/courses/${form.id}`
            : `${store.getters['GET_URL']}/courses`;
          const method = isEdit.value ? 'PUT' : 'POST';
          
          const bodyData = {
            courseName: form.courseName,
            semester: form.semester,
            groupId: form.groupId,
            hours: form.hours
          };
          if (isEdit.value) {
            bodyData.courseId = form.id;
          }

          const response = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(bodyData)
          });

          if (response.ok) {
            ElMessage.success(isEdit.value ? 'Course updated successfully' : 'Course created successfully');
            dialogVisible.value = false;
            fetchCourses();
          } else {
            ElMessage.error('Failed to save course');
          }
        } catch (e) {
          ElMessage.error('Error saving course');
        } finally {
          saving.value = false;
        }
      }
    };

    return {
      courses,
      groups,
      loading,
      dialogVisible,
      isEdit,
      saving,
      form,
      formRef,
      rules,
      selectedGroupFilter,
      fetchCourses,
      openCreateModal,
      openEditModal,
      deleteCourse,
      saveCourse
    };
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/buttons.scss';
</style>
