<script setup lang="ts">
import { ref, onMounted } from 'vue';
// Assuming NavbarDashboard is your sidebar/layout component
// import NavbarDashboard from '@/components/StudentSidebar.vue';

// Shadcn-vue components (though we'll override colors directly)
import { Card, CardContent } from '@/components/ui/card'; // Simplified Card usage
import { ScrollArea } from '@/components/ui/scroll-area';

const rules = [
  // ... (rules data remains the same as your previous example)
  {
    id: 1,
    text: 'Maintain silence, proper decorum, and discipline inside the laboratory. Mobile phones, walkmans and other personal pieces of equipment must be switched off.',
  },
  {
    id: 2,
    text: 'Games are not allowed inside the lab. This includes computer-related games, card games and other games that may disturb the operation of the lab.',
  },
  {
    id: 3,
    text: 'Surfing the Internet is allowed only with the permission of the instructor. Downloading and installing of software are strictly prohibited.',
  },
  {
    id: 4,
    text: 'Getting access to other websites not related to the course (especially pornographic and illicit sites) is strictly prohibited.',
  },
  { id: 5, text: 'Deleting computer files and changing the set-up of the computer is a major offense.' },
  {
    id: 6,
    text: 'Observe computer time usage carefully. A fifteen-minute allowance is given for each use. Otherwise, the unit will be given to those who wish to "sit-in".',
  },
  {
    id: 7,
    text: 'Observe proper decorum while inside the laboratory.',
    subRules: [
      'Do not get inside the lab unless the instructor is present.',
      'All bags, knapsacks, and the likes must be deposited at the counter.',
      'Follow the seating arrangement of your instructor.',
      'At the end of class, all software programs must be closed.',
      'Return all chairs to their proper places after using.',
    ],
  },
  {
    id: 8,
    text: 'Chewing gum, eating, drinking, smoking, and other forms of vandalism are prohibited inside the lab.',
  },
  {
    id: 9,
    text: 'Anyone causing a continual disturbance will be asked to leave the lab. Acts or gestures offensive to the members of the community, including public display of physical intimacy, are not tolerated.',
  },
  {
    id: 10,
    text: 'Persons exhibiting hostile or threatening behavior such as yelling, swearing, or disregarding requests made by lab personnel will be asked to leave the lab.',
  },
  { id: 11, text: 'For serious offense, the lab personnel may call the Civil Security Office (CSU) for assistance.' },
  {
    id: 12,
    text: 'Any technical problem or difficulty must be addressed to the laboratory supervisor, student assistant or instructor immediately.',
  },
];

const ruleItems = ref<HTMLElement[]>([]);
onMounted(() => {
  // Staggered animation logic (same as before)
  const animatedElements = document.querySelectorAll('.animate-on-load');
  animatedElements.forEach((item, index) => {
    (item as HTMLElement).style.setProperty('--delay', `${index * 100}ms`);
    item.classList.add('animate-fade-in-up'); // Or 'animate-fade-in'
  });
});
</script>

<template>
  <div class="flex flex-col items-center min-h-screen bg-[#181818] text-neutral-100 pt-8 pb-16">
    <header class="mb-10 text-center animate-on-load opacity-0">
      <h1 class="text-sm font-semibold uppercase tracking-wider text-[#00BD7E] mb-1">
        University of Cebu
      </h1>
      <h2 class="text-lg font-medium text-neutral-400 mb-4">
        College of Information and Computer Studies
      </h2>
      <p class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-50">
        Laboratory Rules & Regulations
      </p>
    </header>

    <ScrollArea class="w-full max-w-3xl px-4">
      <div class="space-y-8">
        <div class="bg-[#222222] p-6 rounded-lg shadow-lg animate-on-load opacity-0">
          <p class="text-lg leading-relaxed text-neutral-300 text-center sm:text-left">
            To avoid embarrassment and maintain camaraderie with your friends and superiors at our
            laboratories, please observe the following:
          </p>
        </div>

        <section class="space-y-5">
          <div
            v-for="(rule) in rules"
            :key="rule.id"
            ref="ruleItems"
            class="flex items-start gap-4 p-4 rounded-lg border border-[#333333] bg-[#222222] shadow-sm transition-all hover:shadow-lg hover:border-[#00BD7E]/50 animate-on-load opacity-0"
          >
            <div
              class="flex-shrink-0 h-8 w-8 bg-[#00BD7E] text-white rounded-full flex items-center justify-center font-semibold text-sm mt-1"
            >
              {{ rule.id }}
            </div>
            <div class="flex-1">
              <p class="text-base leading-relaxed text-neutral-100">
                {{ rule.text }}
              </p>
              <ul v-if="rule.subRules" class="mt-3 space-y-2 pl-5">
                <li
                  v-for="(subRule, subIndex) in rule.subRules"
                  :key="subIndex"
                  class="flex items-start gap-2 text-sm text-neutral-400"
                >
                  <svg
                    class="h-4 w-4 mt-1 flex-shrink-0 text-[#00BD7E]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{{ subRule }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      <div class="h-10"></div> <!-- Spacer for bottom of scroll area -->
    </ScrollArea>
  </div>
</template>

<style>
/* Global Animations (same as before, ensure these are in your global CSS) */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation utility classes (applied dynamically via JS) */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  animation-delay: var(--delay, 0ms);
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: var(--delay, 0ms);
}

/* Custom Scrollbar for WebKit browsers to match the new theme */
/* Apply this if you want a themed scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #222222; /* Slightly lighter than page background */
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: #00BD7E; /* Primary accent color */
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #00a06b; /* Slightly darker accent on hover */
}
</style>