import * as isolate from "./isolate"
// @ponicode
describe("isolate.inScope", () => {
    test("0", () => {
        let callFunction: any = () => {
            isolate.inScope(10)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            isolate.inScope(1000)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            isolate.inScope("Jean-Philippe")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            isolate.inScope(false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            isolate.inScope([true, true, false, true, false])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            isolate.inScope(-Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("isolate.isolateActionSource", () => {
    test("0", () => {
        let callFunction: any = () => {
            isolate.isolateActionSource("bc23a9d531064583ace8f67dad60f6bb", 80)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            isolate.isolateActionSource({ action$$: ["DELETE", "discard", "DELETE", "remove", "SHUTDOWN", "SHUTDOWN", "DELETE"] }, 11)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            isolate.isolateActionSource("SHUTDOWN", true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            isolate.isolateActionSource("DELETE", true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            isolate.isolateActionSource(12345, 11)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            isolate.isolateActionSource(-Infinity, -Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("isolate.isolateActionSink", () => {
    test("0", () => {
        let callFunction: any = () => {
            isolate.isolateActionSink(12345, 128)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            isolate.isolateActionSink(true, false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            isolate.isolateActionSink(12345, "George")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            isolate.isolateActionSink(true, true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            isolate.isolateActionSink("Sei Whale", false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            isolate.isolateActionSink(-Infinity, -Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})
