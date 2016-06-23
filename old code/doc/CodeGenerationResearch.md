# Code Gen Research
---

## End-goal

Overall the end goal is to analyze both a REST endpoint (possibly exposed through C# controller classes) and C# Object models to generate AngularJS repsitories.  This analysis and generation is not real time, but rather will be a stand alone executable.  The advantage of this is that the generation can take place at the same time as any other statically generated classes (such as the C# equivalent of jaxb generated classes): generation happens as a task on a build script.  With code generated before and or during the build of the application as a whole, it is potentially easy to validate the generated code, either through unit tests or integration tests (or integration tests posing as unit tests)


## Potentially Useful Technologies

1. AngularJS - the target 'language' which code will be generated to
  1. AngularJS repository pattern
2. Typescript - ty[ed javascript which could be used to ensure that the generated code compiles
3. C# - used to generate the DTO (json, xml, etc.) which is transfered between the REST endpoint and the angularJS frontend.
  1. The client has stated that C# partial classes are being used, so any analysis of the DTO object models needs to take this into account.
4. CodeDom - a microsoft project which can emit code in several languages at once

## Generation strategy

The problems of code generation and code compilation are essentially the same problems wearing different faces.  Each will have 3 basic phases: 
1. lexical analysis - create tokens from some unit, in our case classes 
2. parsing - verify syntax, which might not be neccessary in our case if the app runs after compilation of C# (which would verify correct syntax)
3. code generation - actually generating the machine code, in our case generating JS code (possibly from templates)

Since the generation of code is a static process which will happen at a predetermined time (e.g. building of application), the general workflow will be as follows:

1. Analyze object models to get a baseline of what an Object is named and what attributes it has, taking into account partial classes
2. Analyze REST endpoint to see which endpoints will return which object models 
3. Map up REST urls to Objects
4. Generate JS code based on the above map
5. Validate JS code
 
But as always the devil is in the details.  For example analyzing the object models would seemingly require some kind of naive C# parser, depending on how complicated these object models are.  For example, this analysis might need to take into account inheritance, parital classes, and (God forbid) AOP.  However if the object models are really simple POCOs, the parser could be relatively simple; in this case do a really naive implementation which just looks for keywords.

Since pretty much everything generated is static at time of generation, we could probably accomplish this using a template.  The JS object model (DTO) would be extremely static, essentially just representing the POCO.  The the JS repositories could be a template which relates a DTO to an object model.

## Interesting links

### REST
Question on stack exchange about Web Endpoints:

http://stackoverflow.com/questions/9807382/what-is-a-web-service-endpoint

Links included in an answer to said question:

http://www.w3.org/TR/wsdl.html

http://www.ehow.com/info_12212371_definition-service-endpoint.html

###Code Gen

http://www.javaworld.com/article/2075801/java-se/reflection-vs--code-generation.html

https://msdn.microsoft.com/en-us/library/650ax5cx(v=vs.110).aspx

https://en.wikipedia.org/wiki/Comparison_of_code_generation_tools

http://www.methodsandtools.com/archive/archive.php?id=86

## Questions for Client

1. Can we get a look at the Object models to determine the depth of analysis which needs to go into this?
  1.  For example: can a REST call return a primitive, or will it always be wrapped in an object model?
2. Need some details in how they have implemented the AngularJS design pattern.
  3.  basically just need a mapping of controllers to URLs
