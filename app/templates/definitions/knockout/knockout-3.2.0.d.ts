/// <reference path="knockout.d.ts" />

interface KnockoutStatic {
	components: KnockoutComponents;
}

interface KnockoutComponents {
	register(componentName: string, config: any): void;
}