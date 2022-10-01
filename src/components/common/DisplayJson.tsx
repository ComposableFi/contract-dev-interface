import { FunctionComponent } from 'react';

import dynamic from 'next/dynamic';

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

export const DisplayJson: FunctionComponent<{ data: any; collapseStringsAfterLength?: number }> = ({
	data,
	collapseStringsAfterLength = 20,
}) => {
	return (
		<ReactJson
			shouldCollapse={key => {
				if (key.name === 'codes' || key.name === 'data') return true;
				return false;
			}}
			theme="monokai"
			src={data}
			collapseStringsAfterLength={collapseStringsAfterLength}
			enableClipboard
		/>
	);
};
