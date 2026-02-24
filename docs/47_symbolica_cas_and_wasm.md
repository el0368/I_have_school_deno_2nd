# Understanding Symbolica CAS and WebAssembly Limitations

## What is Symbolica?
[Symbolica](https://symbolica.io/) is a modern, extremely fast Computer Algebra System (CAS) written in Rust. It was originally designed to handle massive algebraic expressions found in high-energy physics (like calculating Feynman diagrams), where equations can easily span gigabytes of memory.

## How is Symbolica Made? (Architecture)

Symbolica achieves its incredible speed through three main architectural choices:

1. **Flat Memory Representation (Cache Locality):**
   Traditional CAS engines (like SymPy or Mathematica) store math expressions as deeply nested "trees" of pointers in memory. Jumping between these pointers is slow because it causes CPU cache misses. Symbolica stores expressions in flat, contiguous arrays. This allows the CPU to process massive polynomials sequentially at lightning speed.

2. **Aggressive Multi-Threading (`rayon`):**
   When multiplying two massive polynomials (e.g., expanding `(x + y + z)^100`), Symbolica splits the work across all available CPU cores using a Rust library called `rayon`. It uses work-stealing algorithms to ensure no CPU core sits idle.

3. **Arbitrary-Precision Arithmetic (GMP/MPFR):**
   In advanced algebra, coefficients quickly exceed the maximum size of standard 64-bit or 128-bit integers. To prevent integer overflow, Symbolica uses the `rug` crate, which is a Rust wrapper around two legendary C libraries:
   * **GMP (GNU Multiple Precision Arithmetic Library):** For infinitely large integers and rational numbers.
   * **MPFR (GNU Multiple Precision Floating-Point Reliable Library):** For infinitely precise floating-point numbers.

---

## Why is Symbolica NOT Compatible with WebAssembly (`.wasm`)?

When we tried to compile Symbolica to the `wasm32-unknown-unknown` target for the browser, it failed. Here is exactly why:

### 1. The C-Library Blocker (GMP/MPFR)
WebAssembly is a virtual machine instruction set. When you compile pure Rust to WASM, the compiler translates Rust directly into WASM instructions. 

However, Symbolica depends on `rug`, which depends on GMP and MPFR. These are **C libraries heavily optimized with raw Assembly code** specific to x86 or ARM processors. They rely on the host Operating System for memory allocation and hardware-specific math instructions. 
The standard WASM compiler (`wasm-pack`) does not know how to cross-compile complex, OS-dependent C/Assembly code into a browser sandbox. It throws an error because it cannot find a compatible C compiler for the WASM target.

### 2. The Multi-Threading Blocker (`rayon`)
Symbolica relies on `rayon` to spawn OS-level threads. 
By default, WebAssembly in the browser runs on a **single-threaded event loop** (the JavaScript main thread). While WASM *can* support multi-threading using Web Workers and `SharedArrayBuffer`, it requires a highly specialized build configuration (`-Z build-std=panic_abort,std --target-feature=+atomics,+bulk-memory`) and complex JavaScript glue code to manage the thread pool. Standard `wasm-pack` builds do not support this out of the box.

### 3. Dynamic Loading (`libloading`)
Symbolica has features to interface with Python and Mathematica, which rely on dynamically loading shared libraries (`.dll`, `.so`, `.dylib`) at runtime. The browser WASM sandbox strictly forbids dynamic library loading for security reasons.

---

## Summary

Symbolica is a **"Heavy Metal"** library. It is designed to run on powerful desktop CPUs or server clusters, utilizing raw Assembly math instructions and OS-level threading to achieve maximum performance. 

WebAssembly (`wasm32-unknown-unknown`), on the other hand, is a **"Sandbox"** environment. It expects pure, platform-agnostic code (like `mathcore`) that doesn't try to talk to the OS, spawn native threads, or run raw Assembly. 

If you ever want to use Symbolica in your project, you will have to run it on your **Deno Server** (where it has access to the real OS and CPU), rather than in the student's browser.