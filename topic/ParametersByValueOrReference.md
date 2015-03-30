---
layout: topic
permalink: "/topic/ParametersByValueOrReference/"
title: "ParametersByValueOrReference"

---

<small>Refactoring Note: I split off this topic from the topic PublicAndPrivateVariables. I leave it to others to revise content from ThreadMode to DocumentMode. -- RandyPearson -- I summarized the conversation and now, hopefully, we've got something we can all hang our hats on-- [[Steven Black]]</small>
----
Most languages, FoxPro included, allow you to pass parameters to routines either "by value" or "by reference".  When you pass by value, you are passing a copy of the item to the routine. Pass by value means  that if the routine makes changes to the parameter, it happens to the copy and not the item in the calling routine. When you pass by reference, you are passing the item itself, and the routine may modify it.

As an example of the difference, one could ask "Please add the numbers 4 and 5." This would be an example of a "pass by value." Alternately, one could ask "Please add the numbers on the papers in cubbies 15a and 15b." This would be an example of "pass by reference." In the second case, the person doing the addition has the opportunity to modify the data before, during or after acting on it.

In Visual FoxPro, by default, parameters are passed to Procedures by reference and to Functions by value. But VFP has a SetUDFParms setting which controls how parameters are passed to functions. Changing the default setting of <code>SET UDFPARMS</code> can cause errors which are difficult to debug (see SetUDFParms for why).

<B>@</B>
Functions and procedures can be expressly passed parameters by reference by prepending @ before the parameter's name during the call. The calling program has call-by-call control over how the parameter is passed by using the "@" pass by reference token. The @ token would be used in procedure calls to alert programmers to the fact that the parameter is expected to change. Example:
<Code>
Function IncreasePrices<BR />
param SubjectPrice<BR />
SubjectPrice = SubjectPrice * 1.1<BR />
return .t.<BR />
<BR />
IncreasePrices( @itemprice)  && changes<BR />
IncreasePrices( shippingprice)  && does not change<BR />
</code>

<b>DO ... WITH ...</a>
Procedures, called with the DO ... WITH syntax also can control the passing style of the parameters.  By default parameters are passed by reference to procedures, however, enclosing the parameter name in () parens will cause the parameter to be passed by value as in;

<code>DO MYProc WITH Var1, (Var2)</code> where Var1 is passed by reference and Var2 is passed by value.

<b>Objects</b> contents are always passed by reference, though the object reference itself can be passed by reference or value. See PassingObjectReferences for a complete discussion.  When passed by value the value passed is a pointer to the object.  This causes the properties manipulated within the called routine to affect the object that was passed to the routine.  Altering the parameter (a pointer) by setting it to NULL does not release the original object.  If the object was passed by reference then nulling the parameter will release the original object (given that there are no other references to the object).

<b>Arrays</b> must be passed by reference, which is the default for calling procedures (DO MyProc WITH ...). Since functions receive parameters BY VALUE as the default, when passing an ARRAY into a function, use the @arrayname format or SET UDFPARMS TO REFERENCE.

<table border="1" align="center" cellpadding="4pt">
<tr>
<Th>By Reference</th>
<Th>By Value</th>
</tr>
<tr>
<TD>Procedures</td>
<TD>Functions</td>
</tr>
<tr>
<TD>DO procedure WITH variable1, variable2</td>
<TD>DO procedure WITH (variable1), (variable2)</td>
</tr>

<tr>
<TD>Variables preceded with @</td>
<TD>Variables wrapped in parens () </td>
</tr>
<tr>
<TD>Object Contents</td>
<TD>Possible Object References</td>
</tr>
<tr>
<TD>Arrays</td>
<TD></td>


</tr>
<tr>
<TD>SET UDFPARMS TO REFERENCE</td>
<TD>SET UDFPARMS TO VALUE</td>
</tr>
<tr>
</table>

----
There are many issues related to parameter passing.  Regardless, it can be said that a good practice for writing any routine that will be called from other places is to <i>assume</i> that the parameters have been passed by reference.  Making this assumption will cause you to be very careful about what you do with the parameters being received and can prevent accidental side effects that are really unintended.

Take the VFP functions as an example.  The UPPER() function accepts a character string as a parameter, it manipulates that value and returns the string shifted to uppercase, however it does not affect the original string passed into it. Passing by value accomplishes the same result, the called routine can tear apart its parameter without affecting the calling routine.

Thus a routine should never ASSUME that the paramaters passed to it are ALWAYS going to be passed by VALUE. Thus we can simply avoid changing the value of a parameter to prevent the change having unexpected effects in outside programs.

Example:
<pre><CODE>
* Do it this way if you want to change the var from the calling program.
* The programmer calling this proc must know to pass by reference.
LPARAMETER tcString
tcString = UPPER(ALLTRIM(tcstring))
* More code here

* Do it this way if you dont want to change the var from the calling
* program and you don't want to worry about how the vars were passed
LPARAMETER tcString
LOCAL lcString
lcString = UPPER(ALLTRIM(tcstring))
* More code here

* Even safer...Since parameters may not be passed at all, or
* passed as the wrong variable type, take the above method one more step
* and try this:
LPARAMETER tcString
LOCAL lcString
lcString = IIF( PCOUNT() < 1 .OR. TYPE(tcString) <> 'C', **, UPPER(ALLTRIM(tcstring)))
IF EMPTY( lcString )
  *!* Do some exception handling here
  RETURN .F.
ENDIF
* More code here
</CODE></pre>

<font color='purple'> Somebody tell me if I am wrong here, but the above suggestion to enter an error routine on a non-user entry fuction or procedure is an unnecessary complication.  A programmer using the function is going to get an error message either way if it is not used properly. You do of course have to use data validation on user data entry, but that is completely different from the above example.  Note that the code doubles in size, which on a large program, can be a significant slow in execution.  Further, even if an error is raised by an exception, there is nothing an end user is going to be able to do with it. Thus it is unnecessary.

Isn't this the purpose of an ASSERT?  You use the ASSERT to make sure your function is being called properly during development and then set asserts off and compile the code without the now unnecessary error checking.

Passing by reference or value is part of the routine's <i>contract</i> and in the majority of utility function cases, we want the function to not clobber parameters.

If you pass by reference you expect the parameter item to change. If we always code to defensively disable or ignore pass-by-reference, then we limit the flexibility (and brevity) of calling routines, not to mention handcuff the return value to being the fruits the function, which leads to difficulty in errorhandling (since you can't ever return error codes) and possibly many other things.

Thus if you're talking about <em>standards and conventions</em>, making the assumption that all PARAMETERS have been passed by reference is the safest way to code inside the receiving routine.
----
That's a good reason to differentiate between a function and a procedure in your code. Use procedures to manipulate the parameters and functions to return values.-- MikelMoore
<font color='purple'> But you can't generalize it quite this simply. There are legitimate needs for functions that return more than one value, or at least have the option to do so, and these functions must manipulate (at least one of) the parameters. -- RandyPearson
----
<b><i>Does passing by reference break ?Encapsulation</i></b>  Certainly pass by value protects encapsulation, but it's probably not correct fair to say that passing by reference breaks encapsulation.

For example, this wiki's parsing engine uses pass-by-reference extensively, and the different parsers (topic links, http, mailto, Amazon, kbase, tags) are none the less encapsulated for it.
----
<small><small><small><subliminal-request></p<p>Hey Randy, how about an APARAMS() function that populates an array with information like datatype, isnull, byref/byval, etc?<br><\subliminal-request></small></small></small></p> -- DavidTAnderson</font>
----
One way that I specifically document reference parameters is to use R (reference) as it's scope prefix instead of P (T if you use the CodeBook convention). Doing this warns me of the responsibility I have inside the function and helps remind me what parameters are to be sent with the "@" pass by reference token.
<pre>function AltersAParameter ruAlteredParameter, roCallerObject, pcValueParm
ruAlteredParameter = roCallerObject.Name
roCallerObject.Top = 1000
</pre>
DavidFrankenbach
----
I think the cautions to respect the possibility of parameters passed by reference are an additional argument in support of a practice I've long followed of never (except with malice aforethought) modifying a parameter. If the parameter needs to be modified in some way, I store it to another memvar before doing the dirty deed. I've always followed this practice so that if I need to refer to the parameter in multiple places in the routine, I know that it's still "pristine" and unchanged from what was originally passed. -- SteveSawyer
----
<font color="red">WARNING:</FONT> Any PUBLIC variables (usually assumed to be global in scope) that are passed by REFERENCE get <B>HIDDEN</B> in the called procedure OR function.  See DisappearingPublicVars for more details.
----
Contributors: JahnMargulies, StevenBlack, RandyPearson, DavidTAnderson, JimBooth, PamelaThalacker
----
See Also: NamingConventionsVariables, PublicAndPrivateVariables
----
CategoryNamingConventions CategoryParameters

