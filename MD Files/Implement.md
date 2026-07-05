The real culprit

Look at this:

at KnightModel (Knight.jsx:14:32)

That means line 14 of Knight.jsx is where React detected the hook order changing.

What causes "Rendered more hooks than during the previous render"

Almost always one of these:

❌ Calling hooks conditionally

Example:

if (loaded) {
    const { scene } = useGLTF("/models/knight.glb");
}

or

if (error)
    return null;

const texture = useTexture(...);

React requires hooks to be called in the exact same order every render.

❌ Returning early before all hooks execute

Example:

if (!visible)
    return null;

const { scene } = useGLTF(...);

First render:

0 hooks

Second render:

5 hooks

React throws exactly your error.

❌ Hook inside a loop
models.map(() => {
    useGLTF(...)
})
❌ Hook inside try/catch
try {
   const model = useGLTF(...)
}
❌ Hook inside callback
useEffect(() => {
    useGLTF(...)
})
The GLB replacement probably exposed an existing bug

Here's what I think happened.

Previously:

Huge model
↓

Loading forever
↓

Some state never changed
↓

Conditional code never executed

Now:

4 MB model

↓

Loads immediately

↓

State changes quickly

↓

Different render path

↓

Hook order changes

↓

React throws

So the optimized model didn't create the bug.

It revealed it.

I want to see one file

Please paste the entire contents of:

src/components/3D/Knight.jsx

Not just the error line.

The whole file.

I'm specifically looking for

Things like

if (...)

return (...)

useGLTF(...)

or

if (...)

const texture = useTexture(...)

or

if (...)

useAnimations(...)
I think this is a 5-minute fix

Based on these errors, I don't think your deployment or model is broken anymore.

I think Knight.jsx violates the Rules of Hooks, and once I see the full file, I can point to the exact lines that need to be rearranged.