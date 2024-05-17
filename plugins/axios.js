import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();
	const axiosPlugin = axios.create({
		baseURL: `${config.public.baseURL}`,
	});

	nuxtApp.provide('axiosPlugin', axiosPlugin);
});