<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18n } from '@/composables/useI18n';
import { dashboard, login, register } from '@/routes';
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowRight,
    Check,
    Globe,
    Minus,
    Plus,
    Shield,
    Sparkles,
    Zap,
} from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

withDefaults(
    defineProps<{
        canRegister: boolean;
    }>(),
    {
        canRegister: true,
    },
);

const { t, currentLanguage, setLanguage, availableLanguages } = useI18n();

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
    return billingPeriod.value === 'yearly'
        ? t('pricing.plan.year')
        : t('pricing.plan.month');
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

// Get business types from translations
const businessTypes = computed(() => {
    const types = t('businessTypes');
    return Array.isArray(types) ? types : [];
});

const currentText = ref('');
const currentIndex = ref(0);
const isDeleting = ref(false);
let typewriterTimeout: ReturnType<typeof setTimeout> | null = null;

function typeWriter() {
    const currentWord = businessTypes.value[currentIndex.value];

    if (isDeleting.value) {
        currentText.value = currentWord.substring(
            0,
            currentText.value.length - 1,
        );

        if (currentText.value === '') {
            isDeleting.value = false;
            currentIndex.value =
                (currentIndex.value + 1) % businessTypes.value.length;
            typewriterTimeout = setTimeout(typeWriter, 100);
        } else {
            typewriterTimeout = setTimeout(typeWriter, 50);
        }
    } else {
        currentText.value = currentWord.substring(
            0,
            currentText.value.length + 1,
        );

        if (currentText.value === currentWord) {
            typewriterTimeout = setTimeout(() => {
                isDeleting.value = true;
                typeWriter();
            }, 2000);
        } else {
            typewriterTimeout = setTimeout(typeWriter, 100);
        }
    }
}

watch(currentLanguage, () => {
    currentText.value = '';
    currentIndex.value = 0;
    isDeleting.value = false;
    if (typewriterTimeout) {
        clearTimeout(typewriterTimeout);
    }
    typeWriter();
});

onMounted(() => {
    currentText.value = '';
    currentIndex.value = 0;
    isDeleting.value = false;
    typeWriter();
});

onUnmounted(() => {
    if (typewriterTimeout) {
        clearTimeout(typewriterTimeout);
    }
});
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
                        <!-- Language Selector -->
                        <DropdownMenu>
                            <DropdownMenuTrigger as-child>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    class="h-9 w-9"
                                >
                                    <Globe class="h-4 w-4" />
                                    <span class="sr-only">Select language</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    v-for="lang in availableLanguages"
                                    :key="lang.code"
                                    @click="setLanguage(lang.code)"
                                    :class="{
                                        'bg-accent':
                                            currentLanguage === lang.code,
                                    }"
                                >
                                    {{ lang.name }}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link
                            v-if="$page.props.auth.user"
                            :href="dashboard()"
                            class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {{ t('nav.dashboard') }}
                        </Link>
                        <template v-else>
                            <Link
                                :href="login()"
                                class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {{ t('nav.login') }}
                            </Link>
                            <Link v-if="canRegister" :href="register()">
                                <Button variant="default">
                                    {{ t('nav.getStarted') }}
                                </Button>
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
                        {{ t('hero.title') }}
                        <span
                            class="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                        >
                            {{ currentText
                            }}<span class="animate-pulse">|</span>
                        </span>
                    </h1>
                    <p
                        class="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
                    >
                        {{ t('hero.description') }}
                    </p>
                    <div
                        class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                    >
                        <Link v-if="canRegister" :href="register()">
                            <Button size="lg" class="group">
                                {{ t('cta.getStartedFree') }}
                                <ArrowRight
                                    class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                                />
                            </Button>
                        </Link>
                        <Link :href="login()">
                            <Button size="lg" variant="outline">
                                {{ t('cta.signIn') }}
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
                            {{ t('features.title') }}
                        </h2>
                        <p class="mt-4 text-lg text-muted-foreground">
                            {{ t('features.subtitle') }}
                        </p>
                    </div>

                    <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <Card
                            v-for="(feature, index) in t('features.items')"
                            :key="index"
                        >
                            <CardHeader>
                                <div
                                    class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                                >
                                    <Zap
                                        v-if="index === 0"
                                        class="h-6 w-6 text-primary"
                                    />
                                    <Shield
                                        v-else-if="index === 1"
                                        class="h-6 w-6 text-primary"
                                    />
                                    <Sparkles
                                        v-else
                                        class="h-6 w-6 text-primary"
                                    />
                                </div>
                                <CardTitle>{{ feature.title }}</CardTitle>
                                <CardDescription>
                                    {{ feature.description }}
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
                            {{ t('pricing.title') }}
                        </h2>
                        <p class="mt-4 text-lg text-muted-foreground">
                            {{ t('pricing.subtitle') }}
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
                            {{ t('pricing.monthly') }}
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
                                {{ t('pricing.annually') }}
                            </span>
                            <span
                                v-if="billingPeriod === 'yearly'"
                                class="text-xs font-medium text-green-600"
                            >
                                {{ t('pricing.discount') }}
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
                                    {{ t('pricing.plan.name') }}
                                </h3>
                                <p class="text-sm text-blue-50">
                                    {{ t('pricing.plan.description') }}
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
                                        {{ t('pricing.plan.save') }} €{{
                                            monthlyPrice * 12 - yearlyPrice
                                        }}
                                        {{ t('pricing.plan.perYear') }}
                                    </p>
                                </div>

                                <!-- Team Members Selector -->
                                <div class="mb-8">
                                    <label
                                        class="mb-3 block text-center text-sm font-medium"
                                    >
                                        {{ t('pricing.plan.teamMembers') }}
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
                                    <li
                                        v-for="feature in t(
                                            'pricing.plan.features',
                                        )"
                                        :key="feature"
                                        class="flex items-start gap-3"
                                    >
                                        <Check
                                            class="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                                        />
                                        <span class="text-sm">{{
                                            feature
                                        }}</span>
                                    </li>
                                </ul>

                                <!-- CTA Button -->
                                <Link
                                    v-if="canRegister"
                                    :href="register()"
                                    class="block w-full"
                                >
                                    <Button size="lg" class="group w-full">
                                        {{ t('pricing.plan.getStarted') }}
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
                        <CardTitle class="text-3xl">{{
                            t('finalCta.title')
                        }}</CardTitle>
                        <CardDescription class="text-base">
                            {{ t('finalCta.description') }}
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="flex justify-center">
                        <Link v-if="canRegister" :href="register()">
                            <Button size="lg" class="group">
                                {{ t('finalCta.button') }}
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
                            © {{ new Date().getFullYear() }} Schedule App.
                            {{ t('footer.rights') }}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    </div>
</template>
