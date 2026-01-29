import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import CopyPageButton from '@site/src/components/CopyPageButton';

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props} />
      <CopyPageButton />
    </>
  );
}
