<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { schedule } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import {
    createCalendar,
    createViewDay,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';
import { ScheduleXCalendar } from '@schedule-x/vue';
import 'temporal-polyfill/global';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Schedule',
        href: schedule().url,
    },
];

const calendarApp = createCalendar({
    selectedDate: Temporal.Now.plainDateISO(),
    views: [
        createViewDay(),
        createViewWeek(),
        createViewMonthGrid(),
        createViewMonthAgenda(),
    ],
    events: [
        {
            id: 1,
            title: 'New Year',
            start: Temporal.PlainDate.from('2026-01-01'),
            end: Temporal.PlainDate.from('2026-01-01'),
        },
        {
            id: 2,
            title: 'Haircut',
            start: Temporal.ZonedDateTime.from(
                '2026-01-02T12:00:00+09:00[Asia/Tokyo]',
            ),
            end: Temporal.ZonedDateTime.from(
                '2026-01-02T13:00:00+09:00[Asia/Tokyo]',
            ),
        },
        {
            id: 3,
            title: 'Haircut',
            start: Temporal.ZonedDateTime.from(
                '2026-01-03T12:00:00+09:00[Asia/Tokyo]',
            ),
            end: Temporal.ZonedDateTime.from(
                '2026-01-03T13:00:00+09:00[Asia/Tokyo]',
            ),
        },
    ],
});
</script>

<template>
    <Head title="Schedule" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <ScheduleXCalendar :calendar-app="calendarApp" />
    </AppLayout>
</template>
