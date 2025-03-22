<template>
    <div class="flex absolute justify-between w-screen items-center px-10 top-0 bg-[#202020]">
      <div>
        <img
          @click="$router.push('/dashboard')"
          src="@/assets/logo.svg"
          alt="Logo"
          class="cursor-pointer size-20 drop-shadow-logo"
        />
      </div>
      <div class="flex gap-5 text-lg font-semibold items-center">
        <RouterLink to="/dashboard/admin">Dashboard</RouterLink>
        <RouterLink to="/announce">Announcement</RouterLink>
        <RouterLink to="/students">Students</RouterLink>
        <RouterLink to="/sitins">Sit-ins</RouterLink>
        <RouterLink to="/records">Records</RouterLink>
        <RouterLink to="/feedbacks">Feedbacks</RouterLink>
        <RouterLink class="w-25 py-1 px-2 cursor-pointer bg-[#00BD7E] hover:bg-[#00BD7E]/65 text-white rounded flex item-center justify-center transition-colors duration-400" to="/login">Logout</RouterLink>
      </div>
    </div>
  </template>
  