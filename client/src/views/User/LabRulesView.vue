<script setup lang="ts">
import NavbarDashboard from '@/components/NavbarDashboard.vue';
</script>
<template>
    <NavbarDashboard/>
    <div class="flex flex-col items-center justify-center h-screen w-screen text-white pt-30 gap-5">

        <div class="flex flex-col items-center  w-1/2 text-2xl">
        <div>UNIVERSITY OF CEBU</div>
        <div>COLLEGE OF INFORMATION AND COMPUTER STUDIES</div>
        <div>LABORATORY RULES AND REGULATIONS</div>
      </div>
      <div class=" flex flex-col w-1/2 overflow-scroll text-justify gap-5 font-montserrat">
          <div>
            To avoid embarrassment and maintain camaraderie with your friends and superiors at our
            laboratories, please observe the following:
          </div>
        <ol class=" flex flex-col gap-5 list-decimal pl-10 mb-5">
          <li>
            Maintain silence, proper decorum, and discipline inside the laboratory. Mobile phones,
            walkmans and other personal pieces of equipment must be switched off.
          </li>
          <li>
            Games are not allowed inside the lab. This includes computer-related games, card games and
            other games that may disturb the operation of the lab.
          </li>
          <li>
            Surfing the Internet is allowed only with the permission of the instructor. Downloading
            and installing of software are strictly prohibited.
          </li>
          <li>
            Getting access to other websites not related to the course (especially pornographic and
            illicit sites) is strictly prohibited.
          </li>
          <li>Deleting computer files and changing the set-up of the computer is a major offense.</li>
          <li>
            Observe computer time usage carefully. A fifteen-minute allowance is given for each use.
            Otherwise, the unit will be given to those who wish to "sit-in".
          </li>
          <li>Observe proper decorum while inside the laboratory.</li>
          <ul class="list-disc pl-10">
            <li>Do not get inside the lab unless the instructor is present.</li>
            <li>All bags, knapsacks, and the likes must be deposited at the counter.</li>
            <li>Follow the seating arrangement of your instructor.</li>
            <li>At the end of class, all software programs must be closed.</li>
            <li>Return all chairs to their proper places after using.</li>
          </ul>
          <li>
            Chewing gum, eating, drinking, smoking, and other forms of vandalism are prohibited inside
            the lab.
          </li>
          <li>
            Anyone causing a continual disturbance will be asked to leave the lab. Acts or gestures
            offensive to the members of the community, including public display of physical intimacy,
            are not tolerated.
          </li>
          <li>
            Persons exhibiting hostile or threatening behavior such as yelling, swearing, or
            disregarding requests made by lab personnel will be asked to leave the lab.
          </li>
          <li>
            For serious offense, the lab personnel may call the Civil Security Office (CSU) for
            assistance.
          </li>
          <li>
            Any technical problem or difficulty must be addressed to the laboratory supervisor,
            student assistant or instructor immediately.
          </li>
        </ol>
      </div>
    </div>
  </template>