import state from "./state.js";
import { describe, expect, test } from "@jest/globals";

describe("helper class state",()=>{
	test("can connect to db",()=>{
		const dummy = new state();
		dummy.connect().then(res=>{
			expect(res).toBe(true)
		})
	})
})
