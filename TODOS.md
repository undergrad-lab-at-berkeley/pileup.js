# While reading through this code, I've noticed many things we could improve.

## Visualization items:
- When zooming in, we get to a point where letters are displayed instead of
just colors for the base pair letters.  The way they are currently displayed, they
get cut off, so only half of the letter is visible.
- There are several items you can click on in the visualization (such as a gene)
which triggers a javascript/html alert box to pop up with some information.  This is flawed
in two ways: 1. it would probably be better to have the popup be some sort of react
element, rather than the browser alert box. 2. the data displayed in these alert boxes
is extremly messy and uninterperable; it is absolutely essential that we make this
data easier to understand; that is basically our whole job
- Make sure variants are aligned with the reference genome; right now
it looks like these are not aligned.

## Code maintnance:
- Npm reports many security vulnerabilities in the project; we should deal with these.
- I've noticed a react construct used which the official react website says is better
to avoid (and I think it is deprecated in new versions of react).  This is the
`findDOMNode()` function.  We may want to restructure the code so this is not used.
- When running `npm run build`, it appears that all files are recompiled, so even small changes take
a long time to compile.  It is probably worth seeing if there is some way to have the build
procedure only rebuild files which have been modified.  I suspect this is easier said than done.

## Potential Bugs:
- intersect and intersectall in interval.js
