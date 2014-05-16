decafn8
=======

decafjs core running on top of nashorn

decafn8 is a JavaScript framework for implementing command line programs using the Nashorn JavaScript runtime for the JVM in Java 8.

JavaScript on the JVM has a number of benefits over using a JavaScript runtime implemented for browsers:

1. The JVM has a considerable number of man years of research and development applied to it and it is ongoing.  When they make things smaller/faster/better for the JVM, it benefits everything that uses the JVM - including JavaScript.  JavaScript is compiled into JVM byte codes and the JVM then applies its well tested JIT algorithms to it, gaining near machine language speeds.

2. For every computing problem, there is a solution for it in Java.  Many times, the Java implementation of some library will be superior to what you might cobble together from other sources - see Apache Lucene.  When JavaScript runs in the JVM, it has access to every core Java class, as well as any Java classes on your CLASSPATH.  Simply put, the Java ecosystem is the richest and most robust of any language, and all of it is trivially available to JavaScript programs.

3. The JVM features native threads.  This means that multiple JVM threads can be executing in the same JavaScript context concurrently.  Since threads are not part of the ECMA standards, JavaScript engines for the browser have not been implemented to support threads, nor are they likely to in the foreseable future.

