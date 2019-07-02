<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="utf-8" indent="yes" />
  <xsl:key name="tags" match="tag" use="@name"/>
  <xsl:template match="footnote">
    <xsl:variable name="pos" select="count(preceding::footnote)+1" />
    <sup><a href="#footnote{$pos}">[<xsl:value-of select="$pos" />]</a></sup>
  </xsl:template>

  <xsl:template name="link">
    <xsl:param name="withtags" select="'yes'" />
    <xsl:param name="withdate" select="'yes'" />
    <xsl:text>- </xsl:text><div class="shareditem"><a href="{@url}"><xsl:if test="$withdate='yes'"><xsl:value-of select="@date" /> -- </xsl:if><xsl:value-of
    select="@title" /></a>
    <xsl:if test="$withtags='yes'"><xsl:call-template name="tags" /></xsl:if></div><br />
  </xsl:template>

  <xsl:template match="node">
    
    <xsl:variable name="title" select="@title" />
    <div class="super">
      <div class="post">
	<xsl:apply-templates select="text/*|text/text()"/>
	<xsl:if test="count(text//footnote) > 0">
	  <br /><b>Footnotes:</b>
	</xsl:if>
	<xsl:for-each select="text//footnote">
	  <br />
	  <sup>
	    <a name="footnote{position()}">[<xsl:value-of select="position()" />]</a>
	  </sup> 
	  <xsl:value-of select="." />
	</xsl:for-each>
	<br /> 
     </div>
    </div>
  </xsl:template>

  <xsl:template match="code">
    <div class="codebox">
      <pre><xsl:apply-templates select="./text()|./*" /></pre>
    </div>
  </xsl:template>

  <xsl:template match="/">
    <xsl:apply-templates select="node"/>
  </xsl:template>

  <xsl:template match="@*|node()">
    <xsl:copy><xsl:apply-templates select="@*|node()" /></xsl:copy>
  </xsl:template>
</xsl:stylesheet>
