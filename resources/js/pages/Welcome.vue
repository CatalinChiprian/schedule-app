<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useAppearance } from '@/composables/useAppearance';
import { dashboard, login, register } from '@/routes';
import { Head, Link } from '@inertiajs/vue3';
import { ArrowRight, Moon, Shield, Sparkles, Sun, Zap } from 'lucide-vue-next';
import { computed } from 'vue';

withDefaults(
    defineProps<{
        canRegister: boolean;
    }>(),
    {
        canRegister: true,
    },
);

const { appearance, updateAppearance } = useAppearance();

const isDark = computed(() => {
    if (typeof window === 'undefined') {
        return false;
    }
    const current = appearance.value;
    if (current === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return current === 'dark';
});

function toggleTheme() {
    updateAppearance(isDark.value ? 'light' : 'dark');
}
</script>

<template>
    <Head title="Welcome">
        <meta
            name="description"
            content="Modern scheduling application built with Laravel and Vue"
        />
    </Head>

    <div class="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <!-- Navigation -->
        <header
            class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
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
                    <button
                        @click="toggleTheme"
                        class="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        aria-label="Toggle theme"
                    >
                        <Sun v-if="isDark" class="h-4 w-4" />
                        <Moon v-else class="h-4 w-4" />
                    </button>
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
                    The modern scheduling solution that helps you manage your
                    time, appointments, and tasks with ease. Built for teams and
                    individuals who value efficiency.
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
                        <Button size="lg" variant="outline"> Sign In </Button>
                    </Link>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="container mx-auto px-4 py-20">
            <div class="mx-auto max-w-6xl">
                <div class="text-center">
                    <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything you need to stay organized
                    </h2>
                    <p class="mt-4 text-lg text-muted-foreground">
                        Powerful features designed to make scheduling effortless
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
                                Enjoy a modern, intuitive interface that makes
                                scheduling a pleasure, not a chore.
                            </CardDescription>
                        </CardHeader>
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
                        <span class="text-sm font-medium">Schedule App</span>
                    </div>
                    <p class="text-sm text-muted-foreground">
                        © {{ new Date().getFullYear() }} Schedule App. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    </div>
</template>
