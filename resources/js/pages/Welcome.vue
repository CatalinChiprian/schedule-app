<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowRight,
    Check,
    Minus,
    Plus,
    Shield,
    Sparkles,
    Zap,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';

withDefaults(
    defineProps<{
        canRegister: boolean;
    }>(),
    {
        canRegister: true,
    },
);

const billingPeriod = ref<'monthly' | 'yearly'>('monthly');
const teamMembers = ref(1);

const basePricePerMonth = 19;
const additionalMemberPrice = 5;
const yearlyDiscount = 0.1;

const monthlyPrice = computed(() => {
    if (teamMembers.value === 1) {
        return basePricePerMonth;
    }
    return basePricePerMonth + (teamMembers.value - 1) * additionalMemberPrice;
});

const yearlyPrice = computed(() => {
    const monthlyTotal = monthlyPrice.value;
    const yearlyTotal = monthlyTotal * 12;
    return Math.round(yearlyTotal * (1 - yearlyDiscount));
});

const displayPrice = computed(() => {
    if (billingPeriod.value === 'yearly') {
        return yearlyPrice.value;
    }
    return monthlyPrice.value;
});

const pricePeriod = computed(() => {
    return billingPeriod.value === 'yearly' ? 'year' : 'month';
});

function incrementTeamMembers() {
    if (teamMembers.value < 50) {
        teamMembers.value++;
    }
}

function decrementTeamMembers() {
    if (teamMembers.value > 1) {
        teamMembers.value--;
    }
}
</script>

<template>
    <Head title="Welcome">
        <meta
            name="description"
            content="Modern scheduling application built with Laravel and Vue"
        />
    </Head>

    <div class="relative min-h-screen bg-white">
        <!-- Subtle side gradients -->
        <div
            class="pointer-events-none fixed inset-0 z-0"
            style="
                background: linear-gradient(
                    to right,
                    rgba(139, 92, 246, 0.12) 0%,
                    transparent 20%,
                    transparent 80%,
                    rgba(139, 92, 246, 0.12) 100%
                );
            "
        />
        <div class="relative z-10">
            <!-- Navigation -->
            <header
                class="border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60"
            >
                <nav
                    class="container mx-auto flex h-16 items-center justify-between px-4"
                >
                    <div class="flex items-center gap-2">
                        <div
                            class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                        >
                            <Sparkles class="h-5 w-5" />
                        </div>
                        <span class="text-lg font-semibold">Schedule App</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <Link
                            v-if="$page.props.auth.user"
                            :href="dashboard()"
                            class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Dashboard
                        </Link>
                        <template v-else>
                            <Link
                                :href="login()"
                                class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Log in
                            </Link>
                            <Link v-if="canRegister" :href="register()">
                                <Button variant="default"> Get Started </Button>
                            </Link>
                        </template>
                    </div>
                </nav>
            </header>

            <!-- Hero Section -->
            <section class="container mx-auto px-4 py-20 lg:py-32">
                <div class="mx-auto max-w-4xl text-center">
                    <h1
                        class="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                    >
                        Schedule Smarter,
                        <span
                            class="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                        >
                            Not Harder
                        </span>
                    </h1>
                    <p
                        class="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
                    >
                        The modern scheduling solution that helps you manage
                        your time, appointments, and tasks with ease. Built for
                        teams and individuals who value efficiency.
                    </p>
                    <div
                        class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                    >
                        <Link v-if="canRegister" :href="register()">
                            <Button size="lg" class="group">
                                Get Started Free
                                <ArrowRight
                                    class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                                />
                            </Button>
                        </Link>
                        <Link :href="login()">
                            <Button size="lg" variant="outline">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <!-- Features Section -->
            <section class="container mx-auto px-4 py-20">
                <div class="mx-auto max-w-6xl">
                    <div class="text-center">
                        <h2
                            class="text-3xl font-bold tracking-tight sm:text-4xl"
                        >
                            Everything you need to stay organized
                        </h2>
                        <p class="mt-4 text-lg text-muted-foreground">
                            Powerful features designed to make scheduling
                            effortless
                        </p>
                    </div>

                    <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <div
                                    class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                                >
                                    <Zap class="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Lightning Fast</CardTitle>
                                <CardDescription>
                                    Built with modern technologies for instant
                                    performance and seamless user experience.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div
                                    class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                                >
                                    <Shield class="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Secure & Reliable</CardTitle>
                                <CardDescription>
                                    Your data is protected with enterprise-grade
                                    security and regular backups.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div
                                    class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                                >
                                    <Sparkles class="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Beautiful Design</CardTitle>
                                <CardDescription>
                                    Enjoy a modern, intuitive interface that
                                    makes scheduling a pleasure, not a chore.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            <!-- Pricing Section -->
            <section class="container mx-auto px-4 py-20">
                <div class="mx-auto max-w-4xl">
                    <div class="mb-12 text-center">
                        <h2
                            class="text-3xl font-bold tracking-tight sm:text-4xl"
                        >
                            Simple, Transparent Pricing
                        </h2>
                        <p class="mt-4 text-lg text-muted-foreground">
                            Choose the plan that works for you
                        </p>
                    </div>

                    <!-- Billing Toggle -->
                    <div class="mb-12 flex items-center justify-center gap-4">
                        <span
                            :class="[
                                'text-sm font-medium transition-colors',
                                billingPeriod === 'monthly'
                                    ? 'text-foreground'
                                    : 'text-muted-foreground',
                            ]"
                        >
                            Monthly
                        </span>
                        <button
                            @click="
                                billingPeriod =
                                    billingPeriod === 'monthly'
                                        ? 'yearly'
                                        : 'monthly'
                            "
                            :class="[
                                'relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none',
                                billingPeriod === 'yearly'
                                    ? 'bg-primary'
                                    : 'bg-gray-200',
                            ]"
                        >
                            <span
                                :class="[
                                    'inline-block h-6 w-6 transform rounded-full bg-white transition-transform',
                                    billingPeriod === 'yearly'
                                        ? 'translate-x-7'
                                        : 'translate-x-1',
                                ]"
                            />
                        </button>
                        <div class="flex flex-col">
                            <span
                                :class="[
                                    'text-sm font-medium transition-colors',
                                    billingPeriod === 'yearly'
                                        ? 'text-foreground'
                                        : 'text-muted-foreground',
                                ]"
                            >
                                Annually
                            </span>
                            <span
                                v-if="billingPeriod === 'yearly'"
                                class="text-xs font-medium text-green-600"
                            >
                                10% discount
                            </span>
                        </div>
                    </div>

                    <!-- Pricing Card -->
                    <div class="mx-auto max-w-md">
                        <Card
                            class="overflow-hidden border-2 border-primary/20"
                        >
                            <!-- Card Header with Gradient -->
                            <div
                                class="bg-gradient-to-br from-blue-500 to-teal-500 p-8 text-center text-white"
                            >
                                <h3 class="mb-2 text-2xl font-bold">
                                    Appointments
                                </h3>
                                <p class="text-sm text-blue-50">
                                    Manage your schedule and bookings easily
                                    online
                                </p>
                            </div>

                            <CardContent class="p-8">
                                <!-- Price Display -->
                                <div class="mb-6 text-center">
                                    <div
                                        class="flex items-baseline justify-center gap-2"
                                    >
                                        <span class="text-4xl font-bold">
                                            €{{ displayPrice }}
                                        </span>
                                        <span class="text-muted-foreground">
                                            /{{ pricePeriod }}
                                        </span>
                                    </div>
                                    <p
                                        v-if="billingPeriod === 'yearly'"
                                        class="mt-2 text-sm text-muted-foreground"
                                    >
                                        Save €{{
                                            monthlyPrice * 12 - yearlyPrice
                                        }}
                                        per year
                                    </p>
                                </div>

                                <!-- Team Members Selector -->
                                <div class="mb-8">
                                    <label
                                        class="mb-3 block text-center text-sm font-medium"
                                    >
                                        Team Members
                                    </label>
                                    <div
                                        class="flex items-center justify-center gap-4"
                                    >
                                        <button
                                            @click="decrementTeamMembers"
                                            :disabled="teamMembers === 1"
                                            class="flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Minus class="h-4 w-4" />
                                        </button>
                                        <span
                                            class="w-12 text-center text-2xl font-semibold"
                                        >
                                            {{ teamMembers }}
                                        </span>
                                        <button
                                            @click="incrementTeamMembers"
                                            :disabled="teamMembers === 50"
                                            class="flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Plus class="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <!-- Features List -->
                                <ul class="mb-8 space-y-3">
                                    <li class="flex items-start gap-3">
                                        <Check
                                            class="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                                        />
                                        <span class="text-sm"
                                            >Online calendar</span
                                        >
                                    </li>
                                    <li class="flex items-start gap-3">
                                        <Check
                                            class="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                                        />
                                        <span class="text-sm"
                                            >Online bookings</span
                                        >
                                    </li>
                                    <li class="flex items-start gap-3">
                                        <Check
                                            class="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                                        />
                                        <span class="text-sm"
                                            >Appointment reminders</span
                                        >
                                    </li>
                                    <li class="flex items-start gap-3">
                                        <Check
                                            class="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                                        />
                                        <span class="text-sm"
                                            >Client management</span
                                        >
                                    </li>
                                    <li class="flex items-start gap-3">
                                        <Check
                                            class="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                                        />
                                        <span class="text-sm"
                                            >Google Calendar 2-way sync</span
                                        >
                                    </li>
                                </ul>

                                <!-- CTA Button -->
                                <Link
                                    v-if="canRegister"
                                    :href="register()"
                                    class="block w-full"
                                >
                                    <Button size="lg" class="group w-full">
                                        Get Started
                                        <ArrowRight
                                            class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                                        />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <!-- CTA Section -->
            <section class="container mx-auto px-4 py-20">
                <Card
                    class="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10"
                >
                    <CardHeader class="text-center">
                        <CardTitle class="text-3xl"
                            >Ready to get started?</CardTitle
                        >
                        <CardDescription class="text-base">
                            Join thousands of users who are already scheduling
                            smarter
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="flex justify-center">
                        <Link v-if="canRegister" :href="register()">
                            <Button size="lg" class="group">
                                Create Your Account
                                <ArrowRight
                                    class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                                />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </section>

            <!-- Footer -->
            <footer class="border-t bg-muted/50 py-12">
                <div class="container mx-auto px-4">
                    <div
                        class="flex flex-col items-center justify-between gap-4 sm:flex-row"
                    >
                        <div class="flex items-center gap-2">
                            <div
                                class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                            >
                                <Sparkles class="h-5 w-5" />
                            </div>
                            <span class="text-sm font-medium"
                                >Schedule App</span
                            >
                        </div>
                        <p class="text-sm text-muted-foreground">
                            © {{ new Date().getFullYear() }} Schedule App. All
                            rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    </div>
</template>
