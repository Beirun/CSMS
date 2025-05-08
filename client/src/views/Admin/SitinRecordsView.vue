<script setup lang="ts">
import AdminNavbar from '@/components/AdminSidebar.vue'
import { computed, onBeforeMount, ref, reactive } from 'vue'
import { getSitins } from '@/api/sitin'
import { setDate } from '@/library/date'
import type { Sitin } from '@/types/Sitin'
import { tableHeaders } from '@/library/table'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { purposes, laboratories } from '@/library/list'
import { saveAs } from 'file-saver'

const state = reactive({
  laboratory: '',
  purpose: '',
})


const sitins = ref<Sitin[]>([])
  const fileName = computed(() => {
    return `sitin-report-${state.laboratory}.`;
  });


  const filteredSitins = computed(() => {
  console.log("Selected lab:", state.laboratory);
  console.log("Available sitins:", sitins.value);

  if ((state.laboratory === 'all' || state.laboratory === '') && (state.purpose === 'all' || state.purpose === '')) {
    return sitins.value;
  } 
  else if ((state.purpose !== 'all' && state.purpose !== '') && (state.laboratory === 'all' || state.laboratory === '')) {
    return sitins.value.filter(s => {
      return String(s.sitin_purpose) === String(state.purpose);
    });
  }
  else if ((state.laboratory !== 'all' && state.laboratory !== '') && (state.purpose === 'all' || state.purpose === '')) {
    return sitins.value.filter(s => {
      return String(s.sitin_laboratory) === String(state.laboratory);
    });
  }
  else {
    return sitins.value.filter(s => {
      console.log("Comparing:", String(s.sitin_laboratory), "with", String(state.laboratory));
      console.log(String(s.sitin_laboratory) === String(state.laboratory))
      return String(s.sitin_laboratory) === String(state.laboratory) && String(s.sitin_purpose) === String(state.purpose);
    });
  }
});

const exportData = (format: 'pdf' | 'csv' | 'xlsx') => {
  console.log(state.laboratory)

  console.log(filteredSitins.value)
  if (filteredSitins.value.length === 0) {
    alert(`No records found for Laboratory ${state.laboratory}`);
    return;
  }

  const data = filteredSitins.value.map((sitin:Sitin) => [
    sitin.idno,
    `${sitin.fullname}`,
    sitin.course,
    sitin.yearlevel,
    sitin.sitin_purpose,
    sitin.sitin_laboratory,
    setDate(sitin.sitin_timein),
    setDate(sitin.sitin_timeout),
  ]);

  switch (format) {
    case 'pdf':
      const doc = new jsPDF();
      doc.setFont('Times New Roman', 'semibold').setFontSize(16);
      doc.text(`University of Cebu-Main`, 105, 15, { align: 'center' });
      doc.text(`College of Computer Studies`, 105, 22.5, { align: 'center' });
      doc.text(`Computer Laboratory Sitin Monitoring System Report`, 105, 30, { align: 'center' });
      autoTable(doc, { startY: 40, head: [tableHeaders], body: data.map(row => row.map(String)) });
      doc.save(`${fileName.value}pdf`);
      break;
    
    case 'csv':
      const csvContent = [tableHeaders.join(','), ...data.map(row => row.map(String).join(','))].join('\n');
      const csvBlob = new Blob([csvContent], { type: 'text/csv' });
      saveAs(csvBlob, `${fileName.value}csv`);
      break;
    
    case 'xlsx':
      const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...data]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `Lab ${state.laboratory}`);
      const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${fileName.value}xlsx`);
      break;
  }
};

onBeforeMount(async () => {
  const response = await getSitins()
  sitins.value = response.sitins
  console.log(sitins.value)
})
</script>

<template>
  <div class="flex max-w-screen h-20 flex-col">
    <div class="flex justify-between items-center w-full px-10 pt-20">
      <div class="text-5xl font-bold text-[#f8f8f8]">Sit-in Records</div>
      <div class="flex gap-5">

        <div v-if="!state.laboratory" class="text-lg text-[#f8f8f8] absolute ml-1 mt-1 pointer-events-none">Laboratory</div>
        <select v-model="state.laboratory" class=" focus:ring-0 focus:outline-none text-[#f8f8f8] border-b-1 w-30 border-[#f8f8f8] text-lg px-2 py-1">
          <option class=" focus:ring-0 focus:outline-none text-[#f8f8f8] bg-[#282828] text-lg " v-for="laboratory in laboratories" :key="laboratory" :value="laboratory">{{laboratory === 'all' ? 'All' : 'Lab ' + laboratory}} &nbsp;</option>
        </select>
        <div v-if="!state.purpose" class="text-lg text-[#f8f8f8] absolute ml-40 mt-1 pointer-events-none">Purpose</div>
        <select v-model="state.purpose" class=" focus:ring-0 focus:outline-none text-[#f8f8f8] border-b-1 w-30 border-[#f8f8f8] text-lg px-2 py-1">
          <option class=" focus:ring-0 focus:outline-none text-[#f8f8f8] bg-[#282828] text-lg w-10" v-for="purpose in purposes" :key="purpose" :value="purpose">{{ purpose.charAt(0).toUpperCase() + purpose.slice(1) }}</option>
        </select>
          <button @click="exportData('pdf')" class="bg-primary flex justify-center text-black p-2 rounded">Generate PDF</button>
          <button @click="exportData('csv')" class="bg-primary flex justify-center text-black p-2 rounded">Generate CSV</button>
          <button @click="exportData('xlsx')" class="bg-primary flex justify-center text-black p-2 rounded">Generate Excel</button>
        </div>    
      </div>
    <!-- <div class="h-[1px] w-[calc(100%-280px)] bg-[#f8] my-6 mx-auto">&nbsp;</div> -->
  </div>

  <div class="flex flex-row items-start justify-center h-screen max-w-screen py-30 pl-10">
    <div class="flex flex-col w-full pb-10">
      <div class="-m-1.5 overflow-x-auto">
        <div class="p-1.5 min-w-full inline-block align-middle">
          <div class="overflow-hidden">
            <table v-if="filteredSitins.length > 0" class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th v-for="(header, index) in tableHeaders" :key="index" scope="col"
                    class="px-6 py-3 text-middle text-xl font-bold text-[#f8f8f8] uppercase">
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr :class="index % 2 === 0 ? 'bg-[#202020]' : ''" class="text-lg text-[#f8f8f8]" v-for="(sitin, index) in filteredSitins" :key="sitin.sitin_id">
                  <td v-for="field in ['idno', 'fullname', 'course', 'yearlevel', 'sitin_purpose', 'sitin_laboratory', 'sitin_timein', 'sitin_timeout']" :key="field"
                    class="px-6 py-6 whitespace-nowrap font-semibold text-md text-[#8e8e8e]" 
                    :class="field === 'sitin_laboratory' ? 'w-20 text-center' : field === 'course' || field === 'yearlevel' ? 'text-center' : ''">
                    {{ field === 'sitin_timein' || field === 'sitin_timeout' ? setDate(sitin[field as keyof Sitin]) : sitin[field as keyof Sitin] }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-5xl font-bold text-[#e8e8e8] mt-50 text-center">No records found</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
