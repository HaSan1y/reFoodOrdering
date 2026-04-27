import * as React from "react";
import renderer from "react-test-renderer";
import { MonoText } from "../StyledText";
import { expect, it } from "@jest/globals";
// import '@testing-library/jest-dom';

it(`renders correctly`, () => {
	const tree = renderer.create(<MonoText>Snapshot test!</MonoText>).toJSON();

	expect(tree).toMatchSnapshot();
});
