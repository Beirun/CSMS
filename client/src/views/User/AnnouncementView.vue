<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
import { getAnnouncements } from '@/api/announcement';
import type { Announcement } from '@/types/Announcement';
import { setDate } from '@/library/date'; // Assuming this formats nicely

// Shadcn-vue components
import {
  Card,
  CardContent,
  // CardDescription, // Can be used if needed
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Assuming NavbarDashboard is still used for overall page structure.
// import NavbarDashboard from '@/components/StudentSidebar.vue';

const announcements = ref<Announcement[]>([]);
const isLoading = ref(true);

// Helper to format date for timeline (e.g., "Oct 26" and "2023")
const formatTimelineDate = (dateString: string) => {
  const formattedDate = setDate(dateString); // Use your existing formatter
  const parts = formattedDate.split(','); // Assuming format like "Month Day, Year"
  return {
    main: parts[0]?.trim() || formattedDate,
    secondary: parts[1]?.trim() || '',
  };
};

onBeforeMount(async () => {
  try {
    const response = await getAnnouncements();
    // Sort announcements by date, newest first, if not already sorted
    announcements.value = response.announcements.sort(
      (a: { announcement_date: string | number | Date; }, b: { announcement_date: string | number | Date; }) => new Date(b.announcement_date).getTime() - new Date(a.announcement_date).getTime()
    );
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
  } finally {
    isLoading.value = false;
  }
});

// This value should match the `space-y-*` class used on the timeline container.
// If space-y-10 (2.5rem), then this is '2.5rem'. If space-y-12 (3rem), then '3rem'.
const timelineItemSpacing = '2.5rem'; // Corresponds to space-y-10
</script>

<template>
  <div class="container mx-auto py-10 px-4 md:px-6 lg:px-8">
    <header class="mb-12 text-center">
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
        ANNOUNCEMENTS
      </h1>
    </header>

    <!-- Skeleton Loader for Timeline -->
    <div v-if="isLoading" :class="`space-y-10`"> 
      <div v-for="i in 3" :key="`skeleton-timeline-${i}`" class="flex items-start">
        <!-- Skeleton Date -->
        <div class="w-20 sm:w-24 text-right pr-3 sm:pr-4 flex-shrink-0 pt-0.5">
          <Skeleton class="h-4 w-3/4 mb-1 ml-auto" />
          <Skeleton class="h-3 w-1/2 ml-auto" />
        </div>
        <!-- Skeleton Dot & Line -->
        <div class="relative mx-1 sm:mx-2 flex-shrink-0">
          <Skeleton class="h-4 w-4 sm:h-5 sm:w-5 rounded-full mt-[1px]" />
          <!-- Adjust height based on typical card height + spacing -->
          <Skeleton :class="`absolute top-5 sm:top-6 left-1/2 w-0.5 h-[calc(100% + ${timelineItemSpacing})] -translate-x-1/2`" />
        </div>
        <!-- Skeleton Card -->
        <div class="flex-1 min-w-0 pl-3 sm:pl-4">
          <Card>
            <CardHeader class="py-3 sm:py-4 px-4 sm:px-5">
              <Skeleton class="h-5 w-3/5" />
            </CardHeader>
            <CardContent class="py-3 sm:py-4 px-4 sm:px-5 space-y-2">
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-5/6" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Actual Timeline -->
    <div v-else class="relative">
      
      <div v-if="announcements.length > 0" :class="`space-y-10 flex items-center flex-col `">
        <div
          v-for="(announcement, index) in announcements"
          :key="announcement.announcement_id"
          class="flex items-center"
        >
          <!-- Date Column (Left of timeline) -->
          <div class="w-20 sm:w-24 text-right pr-3 sm:pr-4 flex-shrink-0 pt-0.5">
            <p class="text-sm font-medium text-muted-foreground">
              {{ formatTimelineDate(announcement.announcement_date).main }}
            </p>
            <p class="text-xs text-muted-foreground/80">
              {{ formatTimelineDate(announcement.announcement_date).secondary }}
            </p>
          </div>

          <!-- Timeline Dot & Connector Line -->
          <div class="relative mx-1 sm:mx-2 flex-shrink-0">
            <!-- Dot -->
            <div class="h-4 w-4 sm:h-5 sm:w-5 bg-[#2a2a2a] rounded-full border-2 border-[#00BD7E] flex items-center justify-center shadow-md mt-[1px]">
              <!-- You could put an icon here if desired, e.g., BellIcon -->
            </div>
            <div v-if="index < announcements.length-1"
              :class="`absolute left-2.25 w-0.5 h-[calc(1250%)] bg-[#00BD7E]`"
              aria-hidden="true"
            ></div>
          </div>

          <!-- Content Card (Right of timeline) -->
          <div class="flex-1 min-w-0 pl-3 sm:pl-4 ">
            <Card class="hover:shadow-xl bg-[#212121] transition-shadow duration-300 ease-in-out group w-200">
              <CardHeader class="py-3 sm:py-4 px-4 sm:px-5">
                <CardTitle class="text-3xl leading-1 text-foreground group-hover:text-primary transition-colors">
                  <!-- Using a generic title, or use announcement.title if available -->
                  Announcement <!-- Was "CCS Admin", now more generic. Can be dynamic. -->
                </CardTitle>
                <!-- Optional: If you want to show "CCS Admin" subtly -->
                <!-- <CardDescription class="text-xs pt-1">By CCS Admin</CardDescription> -->
              </CardHeader>
              <CardContent class="py-3 sm:py-4 px-4 sm:px-5">
                <p class="text-base text-foreground/90 leading-relaxed">
                  {{ announcement.announcement_message }}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-12">
        <h2 class="text-2xl font-semibold text-muted-foreground">
          No Announcements Yet
        </h2>
        <p class="text-muted-foreground mt-2">
          Check back later for new updates!
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional page-specific styles can go here if necessary */
/* For example, to ensure the container has a minimum height if content is sparse. */
.container {
  min-height: calc(100vh - 10rem); /* Example: Adjust based on your navbar/footer height */
}
</style>