<script lang="ts">
	import { Button } from 'flowbite-svelte';

	const downloadFile = (fileName: string, url: string) => {
		const downloadLink = document.createElement('a');

		try {
			const extension = url.slice(url.lastIndexOf('.') + 1);
			downloadLink.href = url;
			downloadLink.download = `${fileName}-${Date.now()}.${extension}`;
			downloadLink.click();
		} finally {
			downloadLink.remove();
		}
	};

	function downloadMyListAsJson() {
		console.log('json');
		downloadFile('mylist', '/mylist.json');
	}

	function downloadMyListAsCsv() {
		console.log('csv');
		downloadFile('mylist', '/mylist.csv');
	}
</script>

<div class="flex flex-col gap-4 px-4">
	<Button
		type="submit"
		size="lg"
		color="purple"
		class="text-lg flex flex-row items-center gap-3"
		on:click={downloadMyListAsJson}
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 16 16">
			<path
				fill="currentColor"
				fill-rule="evenodd"
				d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM4.151 15.29a1.176 1.176 0 0 1-.111-.449h.764a.578.578 0 0 0 .255.384c.07.049.154.087.25.114c.095.028.201.041.319.041c.164 0 .301-.023.413-.07a.559.559 0 0 0 .255-.193a.507.507 0 0 0 .084-.29a.387.387 0 0 0-.152-.326c-.101-.08-.256-.144-.463-.193l-.618-.143a1.72 1.72 0 0 1-.539-.214a1.001 1.001 0 0 1-.352-.367a1.068 1.068 0 0 1-.123-.524c0-.244.064-.457.19-.639c.128-.181.304-.322.528-.422c.225-.1.484-.149.777-.149c.304 0 .564.05.779.152c.217.102.384.239.5.41c.12.17.186.359.2.566h-.75a.56.56 0 0 0-.12-.258a.624.624 0 0 0-.246-.181a.923.923 0 0 0-.37-.068c-.216 0-.387.05-.512.152a.472.472 0 0 0-.185.384c0 .121.048.22.144.3a.97.97 0 0 0 .404.175l.621.143c.217.05.406.12.566.211a1 1 0 0 1 .375.358c.09.148.135.335.135.56c0 .247-.063.466-.188.656a1.216 1.216 0 0 1-.539.439c-.234.105-.52.158-.858.158c-.254 0-.476-.03-.665-.09a1.404 1.404 0 0 1-.478-.252a1.13 1.13 0 0 1-.29-.375Zm-3.104-.033a1.32 1.32 0 0 1-.082-.466h.764a.576.576 0 0 0 .074.27a.499.499 0 0 0 .454.246c.19 0 .33-.055.422-.164c.091-.11.137-.265.137-.466v-2.745h.791v2.725c0 .44-.119.774-.357 1.005c-.237.23-.565.345-.985.345a1.59 1.59 0 0 1-.568-.094a1.145 1.145 0 0 1-.407-.266a1.14 1.14 0 0 1-.243-.39Zm9.091-1.585v.522c0 .256-.039.47-.117.641a.862.862 0 0 1-.322.387a.877.877 0 0 1-.47.126a.883.883 0 0 1-.47-.126a.87.87 0 0 1-.32-.387a1.55 1.55 0 0 1-.117-.641v-.522c0-.258.039-.471.117-.641a.87.87 0 0 1 .32-.387a.868.868 0 0 1 .47-.129c.177 0 .333.043.47.129a.862.862 0 0 1 .322.387c.078.17.117.383.117.641Zm.803.519v-.513c0-.377-.069-.701-.205-.973a1.46 1.46 0 0 0-.59-.63c-.253-.146-.559-.22-.916-.22c-.356 0-.662.074-.92.22a1.441 1.441 0 0 0-.589.628c-.137.271-.205.596-.205.975v.513c0 .375.068.699.205.973c.137.271.333.48.589.626c.258.145.564.217.92.217c.357 0 .663-.072.917-.217c.256-.146.452-.355.589-.626c.136-.274.205-.598.205-.973Zm1.29-.935v2.675h-.746v-3.999h.662l1.752 2.66h.032v-2.66h.75v4h-.656l-1.761-2.676h-.032Z"
			/>
		</svg>

		<span> Download as JSON </span>
	</Button>

	<Button
		type="submit"
		size="lg"
		color="purple"
		class="text-lg flex flex-row items-center gap-3"
		on:click={downloadMyListAsCsv}
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 15 15">
			<path
				fill="currentColor"
				d="M13.5 3.5h.5v-.207l-.146-.147l-.354.354Zm-3-3l.354-.354L10.707 0H10.5v.5Zm-4 6V6H6v.5h.5Zm0 2H6V9h.5v-.5Zm2 0H9V8h-.5v.5Zm0 2v.5H9v-.5h-.5Zm2-1H10v.207l.146.147l.354-.354Zm1 1l-.354.354l.354.353l.354-.353l-.354-.354Zm1-1l.354.354l.146-.147V9.5h-.5Zm-10-3V6H2v.5h.5Zm0 4H2v.5h.5v-.5ZM2 5V1.5H1V5h1Zm11-1.5V5h1V3.5h-1ZM2.5 1h8V0h-8v1Zm7.646-.146l3 3l.708-.708l-3-3l-.708.708ZM2 1.5a.5.5 0 0 1 .5-.5V0A1.5 1.5 0 0 0 1 1.5h1ZM1 12v1.5h1V12H1Zm1.5 3h10v-1h-10v1ZM14 13.5V12h-1v1.5h1ZM12.5 15a1.5 1.5 0 0 0 1.5-1.5h-1a.5.5 0 0 1-.5.5v1ZM1 13.5A1.5 1.5 0 0 0 2.5 15v-1a.5.5 0 0 1-.5-.5H1ZM9 6H6.5v1H9V6Zm-3 .5v2h1v-2H6ZM6.5 9h2V8h-2v1ZM8 8.5v2h1v-2H8Zm.5 1.5H6v1h2.5v-1ZM10 6v3.5h1V6h-1Zm.146 3.854l1 1l.708-.708l-1-1l-.708.708Zm1.708 1l1-1l-.708-.708l-1 1l.708.708ZM13 9.5V6h-1v3.5h1ZM5 6H2.5v1H5V6Zm-3 .5v4h1v-4H2Zm.5 4.5H5v-1H2.5v1Z"
			/>
		</svg>
		<span> Download as CSV </span>
	</Button>
</div>
