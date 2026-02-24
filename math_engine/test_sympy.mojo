from python import Python

fn main() raises:
    print("Initializing Mojo Math Engine...")
    
    # 1. Import the Python SymPy library directly into Mojo
    var sympy = Python.import_module("sympy")
    print("Successfully imported SymPy version:", sympy.__version__)
    
    # 2. Define 'x' as a SymPy symbol
    var x = sympy.Symbol("x")
    print("Original Equation: x**2 + 2*x + 1")
    
    # 3. Parse the string into a SymPy expression
    var expr = sympy.sympify("x**2 + 2*x + 1")
    
    # 4. Factor it (high school algebra)
    var factored = sympy.factor(expr)
    print("Factored Result:", factored)
    
    # 5. Integrate it (Calculus)
    var integrated = sympy.integrate(expr, x)
    print("Integrated Result:", integrated)
    
    # 6. Convert to LaTeX for the frontend
    var latex_str = sympy.latex(integrated)
    print("LaTeX Output for Deno:", latex_str)
    
    print("\nSuccess! Mojo and SymPy are communicating perfectly.")
